const mainConf = require('../config/main-config');
const tokenManager = require('../utils/token-manager');
const responseUtils = require('../utils/response-utils');
const TokenModel = require('../model/Token');
const requestTokenGetter = require('../utils/request-token-getter');
const logger = require('log4js').getLogger('token-validator');

const sendMsgCodeResponse = responseUtils.sendMsgCodeResponse;

const getToken = requestTokenGetter.getToken;

const BEARER_AUTH_HEADER = { 'WWW-Authenticate': 'Bearer realm="example"' };

/**
 * Middleware que verifica la validez de un token api.
 * Este middleware debe setearse para interceptar las requests de los 
 * endpoints que utilizan seguridad de tipo token.
 * 
 */
exports.verifyToken = function (req, res, next) {
    logger.debug('Verificando token de query');
    const token = getToken(req);
    if (!token) {
        const headers = BEARER_AUTH_HEADER;
        return sendMsgCodeResponse(res, 'Token no enviado', 401, headers);
    }

    tokenManager.verifyToken(token, (err, decoded) => {
        if (err) return sendMsgCodeResponse(res, 'No autorizado', 401);
        logger.debug(`Token ${token} valido!`);
        req.decodedToken = decoded;
        next();
    });
};

exports.verifyAdminToken = function (req, res, next) {
    const { decodedToken: { adminId } } = req;
    if (mainConf.adminId == adminId) return next();
    else return sendMsgCodeResponse(res, 'No autorizado', 401);
};

// exports.verifyShopadminToken = function (req, res, next) {

// };