const mainConf = require('../config/main-config');
const apiVersion = mainConf.apiVersion;

/**
 * Envia una respuesta de tipo error.
 * @param {Response} res Objeto respuesta http.
 * @param {string} message Mensaje a enviar.
 * @param {number} code Codigo de error.
 * @param {object} headers Encabezados a agregar en la respuesta
 */
function sendMsgCodeResponse(res, message, code, headers = {}) {
    code = code || 200;
    res.status(code);
    for (let headerId in headers) {
        res.setHeader(headerId, headers[headerId]);
    }
    res.send({ code, message });
}

function buildMetadata(count = 0, total = count) {
    return {
        count,
        total,
        'next': '',
        'prev': '',
        'first': '',
        'last': '',
        'version': apiVersion
    };
}

exports.sendMsgCodeResponse = sendMsgCodeResponse;
exports.buildMetadata = buildMetadata;