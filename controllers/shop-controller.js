const Shop = require('../model/Shop');
const responseUtils = require('../utils/response-utils');

exports.getShops = function (req, res) {
    return Shop.find()
        .then( (shops) => {
            res.send({ shops });
        })
        .catch(cause => {
            console.error("Hubo un problema al obtener los Shops, " + cause);
            responseUtils.sendMsgCodeResponse(res , "Hubo un problema al obtener los Shops, " + cause , 500);
        })
};

exports.createShop = function(req , res) {
    const shopJson = req.body;
    return Shop.insert(shopJson)
        .then( ([shop]) => {
            res.send({ shop });
        })
        .catch(cause => {
            console.error("Hubo un problema al crear el Shop: " + JSON.stringify(shopJson) + ", " + cause);
            responseUtils.sendMsgCodeResponse(res , "Hubo un problema al crear el Shop: " + JSON.stringify(shopJson) + ", " + cause , 500);
        })
};