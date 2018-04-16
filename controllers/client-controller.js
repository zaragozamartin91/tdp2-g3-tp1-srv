const Client = require('../model/Client');

const responseUtils = require('../utils/response-utils');

exports.getClient = function (req, res) {
    const clientId = req.params.clientId;
    return Client.findById(clientId)
        .then(([client]) => {
            if (client)
                res.send({ client });
            else
                responseUtils.sendMsgCodeResponse(res, "El cliente no existe", 204);
        })
        .catch(cause => {
            console.error("Hubo un problema al obtener los food types, " + cause);
            responseUtils.sendMsgCodeResponse(res, "Hubo un problema al obtener los food types, " + cause, 500);
        });
};