const Shop = require('../model/Shop');
const responseUtils = require('../utils/response-utils');

exports.getShops = function (req, res) {
    // TODO : LLAMAR AL MODELO DE SHOPS
    const shops = [
        { id:1 , name: 'mercadito', address: 'Sto domingo 1180', zone: 'Martinez', phone: '123', enabled: true }
    ];
    
    res.send({ shops });
};

exports.createShop = function(req , res) {
    const shopJson = req.body;
    Shop.insert(shopJson)
        .then( ([shop]) => {
            res.send({ shop });
        })
        .catch(cause => {
            console.error("Hubo un problema al crear el Shop: " + JSON.stringify(shopJson));
            responseUtils.sendMsgCodeResponse(res , "Hubo un problema al crear el Shop: " + JSON.stringify(shopJson) , 500);
        })
};