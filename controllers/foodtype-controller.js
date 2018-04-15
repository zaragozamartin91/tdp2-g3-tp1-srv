const FoodType = require('../model/FoodType');

const responseUtils = require('../utils/response-utils');

exports.getFoodTypes = function (req, res) {
    return FoodType.find()
        .then((foodTypes) => {
            res.send({ foodTypes });
        })
        .catch(cause => {
            console.error("Hubo un problema al obtener los food types, " + cause);
            responseUtils.sendMsgCodeResponse(res, "Hubo un problema al obtener los food types, " + cause, 500);
        });
};