const Shop = require('../model/Shop');
const responseUtils = require('../utils/response-utils');

exports.getShops = function (req, res) {
    return Shop.find()
        .then((shops) => {
            res.send({ shops });
        })
        .catch(cause => {
            console.error("Hubo un problema al obtener los Shops, " + cause);
            responseUtils.sendMsgCodeResponse(res, "Hubo un problema al obtener los Shops, " + cause, 500);
        });
};

exports.getShopsEnabled = function (req, res) {
    return Shop.findEnabled()
        .then((shops) => {
            res.send({ shops });
        })
        .catch(cause => {
            console.error("Hubo un problema al obtener los Shops habilitados, " + cause);
            responseUtils.sendMsgCodeResponse(res, "Hubo un problema al obtener los Shops habilitados, " + cause, 500);
        });
};

exports.createShop = function (req, res) {
    const shopJson = req.body;
    return Shop.insert(shopJson)
        .then(([shop]) => {
            res.send({ shop });
        })
        .catch(cause => {
            console.error("Hubo un problema al crear el Shop: " + JSON.stringify(shopJson) + ", " + cause);
            responseUtils.sendMsgCodeResponse(res, "Hubo un problema al crear el Shop: " + JSON.stringify(shopJson) + ", " + cause, 500);
        });
};

// TODO : HACER LA VERDADERA FUNCION DE ACTUALIZACION DE SHOPS
exports.updateShop = function (req, res) {
    const shopId = req.params.shopId;
    return Shop.find().then(shops => {
        const shop = shops.find(s => shopId == s.id) || null;
        res.send({ shop });
    }).catch(cause => {
        console.error(cause);
        responseUtils.sendMsgCodeResponse(res, `Error al actualizar shop ${shopId}`, 500);
    });
};

// TODO : HACER LA VERDADERA IMPLEMENTACION DE LA OBTENCION DEL MENU
exports.getShopMenu = function (req, res) {
    const menuStub = [];
    for (let i = 1; i <= 5; i++) {
        const dish = {
            id: i,
            name: 'Plato ' + i,
            cost: 80.0,
            description: 'Plato muy delicioso con muchas especias y cosas locas'
        };
        const menuItem = { dish };
        menuStub.push(menuItem);
    }
    res.send({ menu: menuStub });
};