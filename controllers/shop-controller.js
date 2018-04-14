const Shop = require('../model/Shop');
const ShopAdmin = require('../model/ShopAdmin');

const generatePassword = require('password-generator');

const responseUtils = require('../utils/response-utils');
const emailSender = require('../utils/email-sender');
const tokenManager = require('../utils/token-manager');

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


let thisUrl = process.env.URL || 'http://localhost:5000';

exports.createShop = function (req, res) {
    const shopJson = req.body;

    const shopName = shopJson.name;
    const { adminName, adminEmail } = shopJson;
    const adminPassword = generatePassword();

    const adminObj = {
        name: adminName, email: adminEmail, password: adminPassword
    };

    let newShopAdmin;
    return ShopAdmin.insert(adminObj)
        .then(([shopAdmin]) => {
            console.log('Admin de shop insertado: ' + shopAdmin.id);
            newShopAdmin = shopAdmin;
            shopJson.adminid = newShopAdmin.id;
            return Shop.insert(shopJson);
        }).then(([shop]) => {
            const shopAdminToken = tokenManager.signToken({
                shopId: shop.id,
                shopName,
            });
            const tokenStr = shopAdminToken.token;
            const emailData = {
                to: adminEmail,
                subject: 'Nuevo registro de comercio',
                html: `<p>El comercio <strong>${shopName}</strong> fue dado de alta.<br/>
                Usted ha sido registrado como el administrador.<br/>
                Para completar con el registro de su comercio, ingrese 
                <a href="${thisUrl}/shopreg?token=${tokenStr}">aqui</a>.<br/>
                Su password es: ${adminPassword}</p>`
            };
            return emailSender.sendAdminEmail(emailData);
        }).then(info => {
            console.log(info);
            responseUtils.sendMsgCodeResponse(res, 'Exito', 200);
        }).catch(cause => {
            console.error(cause);
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