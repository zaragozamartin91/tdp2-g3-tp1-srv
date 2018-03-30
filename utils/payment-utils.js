const axios = require('axios');
const logger = require('log4js').getLogger('payment-utils');
const mainConf = require('../config/main-config');
const responseUtils = require('./response-utils');

/* FIN DE IMPORTS --------------------------------------------------------------------------------------------------------- */

const sendMsgCodeResponse = responseUtils.sendMsgCodeResponse;

const MAX_RECONN_TRIES = 3;

const API_VERSION = mainConf.apiVersion;
const DEF_CLIENT_ID = 'ee04c1bd-bd98-4ac9-861e-cff1834e0386';
const DEF_CLIENT_SECRET = '1e238cae-26ae-412d-a7e6-959e89980a13';

const TOKEN_HOLDER = { token: '' };

exports.TOKEN_HOLDER = TOKEN_HOLDER;

/**
 * Actualiza el token de pago si es necesario.
 * @param {string} token Nuevo token de pago.
 * @return {string} Token de pago.
 */
function updateToken(token) {
    if (TOKEN_HOLDER.token != token) { TOKEN_HOLDER.token = token; }
    return TOKEN_HOLDER.token;
}

exports.updateToken = updateToken;

/* Se lee la url del api de pagos desde la variable de entorno PAYMENTS_API_URL o se asigna la de heroku por defecto */
const PAYMENTS_API_URL = mainConf.PAYMENTS_API_URL;
const AUTHORIZE_URL = PAYMENTS_API_URL + '/user/oauth/authorize';
const GET_PAYMENTS_URL = PAYMENTS_API_URL + '/paymethods';
const POST_PAYMENT_URL = PAYMENTS_API_URL + '/payments';

/* GET PAYMETHODS ------------------------------------------------------------------------------------------------------------- */

/**
 * Construye una promesa para obtener los metodos de pago.
 * @param {string} token Token de autenticacion con el api de pagos.
 * @return {Promise} Promesa para obtener los metodos de pago
 */
/* istanbul ignore next */
exports.paymethodsPromise = function (token = TOKEN_HOLDER.token) {
    return axios.get(GET_PAYMENTS_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

function authTokenPromise(client_id = DEF_CLIENT_ID, client_secret = DEF_CLIENT_SECRET) {
    //return axios.post(AUTHORIZE_URL, { client_id, client_secret });
    return axios.post('https://shielded-escarpment-27661.herokuapp.com/api/v1/user/oauth/authorize', { 'client_id': 'ee04c1bd-bd98-4ac9-861e-cff1834e0386', 'client_secret': '1e238cae-26ae-412d-a7e6-959e89980a13' });
}

/* istanbul ignore next */
exports.getTokenPromise = function (renew = false) {
    if (renew || !TOKEN_HOLDER.token) {
        logger.debug('Renovando token');
        return authTokenPromise();
    }

    logger.debug('Reutilizando token ' + TOKEN_HOLDER.token);
    return Promise.resolve({ data: { access_token: TOKEN_HOLDER.token } });
};

/**
 * Crea un arreglo con los metodos de pago.
 * @param {any} items Arreglo de metodos de pago obtenido del api de pagos.
 * @return {Array} Arreglo de metodos de pago.
 */
function buildPaymethodsArray(items = []) {
    return items.map(item => { return { name: item.paymethod, parameters: item.parameters }; });
}

exports.buildPaymethodsArray = buildPaymethodsArray;

/**
 * Obtiene el codigo de error de una causa de error en axios.
 * Considera que el objeto causa tiene la siguiente estructura: 
 * { request: { res: { statusCode } } }.
 * @param {any} cause Causa de un error.
 * @return {number} Codigo de error. 500 como valor por defecto. 
 */
function getStatusCode(cause = { request: { res: { statusCode: 500 } } }) {
    cause.request = cause.request || { res: { statusCode: 500 } };
    cause.request.res = cause.request.res || { statusCode: 500 };
    return cause.request.res.statusCode;
}

exports.getStatusCode = getStatusCode;



function buildMetadata(count, total = count) {
    return { count, total, next: '', prev: '', first: '', last: '', version: API_VERSION };
}

/**
 * [PRIVADO]
 * Obtiene los metodos de pago.
 * @param {Request} req Http request.
 * @param {Response} res Http response.
 * @param {Boolean} renewToken [OPCIONAL] indica si se debe renovar el token de autenticacion.
 */
function __getPaymethods(req, res, renewToken = false, tries = 0) {
    exports.getTokenPromise(renewToken)
        .then(contents => {
            const token = contents.data.access_token;
            updateToken(token);
            return exports.paymethodsPromise(token);
        }).then(contents => {
            const items = contents.data.items || [];
            const metadata = buildMetadata(items.length);
            const paymethods = buildPaymethodsArray(items);
            // agrego el campo currency para informar que lo necesito al dar de alta un viaje
            paymethods.forEach(p => p.currency = 'string');
            res.send({ metadata, paymethods });
        }).catch(cause => {
            const statusCode = getStatusCode(cause);
            const unauthorized = statusCode == 403 || statusCode == 401;
            if (unauthorized && tries < MAX_RECONN_TRIES) {
                logger.debug('Token invalido o expirado...');
                __getPaymethods(req, res, true, tries + 1);
            } else if (unauthorized && tries >= MAX_RECONN_TRIES) {
                logger.debug('Intentos maximos de obtener el token alcanzados...');
                sendMsgCodeResponse(res, 'Intentos maximos de obtener el token alcanzados', 500);
            } else {
                sendMsgCodeResponse(res, 'Error al obtener los medios de pago', statusCode);
            }
        });
}

exports.getPaymethods = function (req, res) {
    return __getPaymethods(req, res);
};


/* PERFORM PAYMENT ------------------------------------------------------------------------------------------------------------- */

function buildCardPaymentData(transactionId, currency, value, parameters) {
    return {
        'transaction_id': transactionId,
        currency: currency,
        value: value,
        paymentMethod: {
            expiration_month: parameters.expiration_month,
            expiration_year: parameters.expiration_year,
            method: 'card',
            type: parameters.type,
            number: parameters.number,
            ccvv: parameters.ccvv
        }
    };
}

function buildCashPaymentData(transactionId, currency, value, parameters) {
    return {
        'transaction_id': transactionId,
        currency: currency,
        value: value,
        paymentMethod: {
            method: 'cash',
            type: parameters.type,
        }
    };
}

/**
 * Construye el objeto de pago para invocar al PUBLIC PAYMENTS API
 * @param {string} transactionId Id de la transaccion local
 * @param {string} currency Moneda (ej:'ARS')
 * @param {number} value Cantidad a pagar
 * @param {string} method Metodo de pago (ej:'card')
 * @param {any} parameters Parametros de pago
 */
function buildPaymentData(transactionId, currency, value, method, parameters) {
    if (method == 'card') return buildCardPaymentData(transactionId, currency, value, parameters);
    if (method == 'cash') return buildCashPaymentData(transactionId, currency, value, parameters);
    throw new Error('No se indico el metodo de pago');
}

exports.buildPaymentData = buildPaymentData;

/* istanbul ignore next */
exports.paymentPromise = function (token = TOKEN_HOLDER.token, paymentData) {
    try {
        console.log(paymentData);
        return axios.post(POST_PAYMENT_URL, paymentData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch (error) {
        console.error(error);
        return Promise.reject({ code: 500, message: 'Estructura de pago incorrecta' });
    }
};

function __postPayment(paymentData, callback, renewToken = false, tries = 0) {
    exports.getTokenPromise(renewToken)
        .then(contents => {
            const token = contents.data.access_token;
            updateToken(token);
            return exports.paymentPromise(token, paymentData);
        }).then(contents => {
            callback(null, contents.data);
        }).catch(cause => {
            const { code, message } = cause;
            if (code && message) return callback({ code, message });

            console.error(cause);

            const statusCode = getStatusCode(cause);
            const unauthorized = statusCode == 403 || statusCode == 401;
            if (unauthorized && tries < MAX_RECONN_TRIES) {
                logger.debug('Token ' + TOKEN_HOLDER.token + ' invalido o expirado...');
                __postPayment(paymentData, callback, true, tries + 1);
            } else if (unauthorized && tries >= MAX_RECONN_TRIES) {
                logger.debug('Intentos maximos de obtener el token alcanzados...');
                callback(new Error('Intentos maximos de obtener el token alcanzados...'));
            } else {
                callback(cause);
            }
        });
}

exports.postPayment = function (paymentData, callback) {
    /* FIXME : se agrega un fallo en el pago a proposito */
    //return callback(new Error('Error de pago modo DEBUG'));
    return __postPayment(paymentData, callback);
};
