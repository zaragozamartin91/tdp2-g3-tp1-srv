const dbManager = require('../model/db-manager');
const moment = require('moment');
const responseUtils = require('../utils/response-utils');
const logger = require('log4js').getLogger('test-data-controller');

const Shop = require('../model/Shop');
const District = require('../model/District');
const ShopAdmin = require('../model/ShopAdmin');
const ShopDetails = require('../model/ShopDetails');

const generatePassword = require('password-generator');

function createTables() {
    return District.createTable()
        .then(e => {
            console.log('Tabla de distritos creada');
            return ShopAdmin.createTable();
        }).then(e => {
            console.log('Tabla de administradores de shops creada');
            return Shop.createTable();
        }).then(e => {
            console.log('Tabla de shops creada');
            return ShopDetails.createTable();
        }).then(e => {
            console.log('Tabla de shops details creada');
            return true;
        }).catch(cause => {
            console.error(cause);
            return false;
        });
}

function insertShopAdmins() {
    const pr = [];
    for (let shopi = 0; shopi < 3; shopi++) {
        let name = 'admin_' + shopi;
        pr.push(ShopAdmin.insert({
            name: name,
            email: name + '@mail.com',
            password: generatePassword()
        }));
    }
    return Promise.all(pr);
}

function insertShops() {
    const pr = [];
    for (let shopi = 0; shopi < 3; shopi++) {
        pr.push(Shop.insert({
            name: 'shop_' + shopi,
            phone: '445567890',
            address: 'address_' + shopi,
            zone: 'zone_' + shopi,
            lat: "0.11111000",
            long: "1.00001111",
            adminid: 1
        }));
    }
    return Promise.all(pr);
}

function insertShopDetails() {
    const pr = [];
    for (let shopi = 1; shopi < 3; shopi++) {
        pr.push(ShopDetails.insert({
            foodtype: 'italiana',
            shopid: shopi
        }));
    }
    return Promise.all(pr);
}

exports.createTestData = function (req, res) {
    createTables().then(b => {
        console.log('TABLAS CREADAS');
        return District.insertDefaults();
    }).then(b => {
        console.log('Distritos insertados');
        return insertShopAdmins();
    }).then(b => {
        console.log('Admins insertados');
        return insertShops();
    }).then(b => {
        console.log('Shops insertados');
        return insertShopDetails();
    }).then(b => {
        console.log('Shops details insertados');
        res.send({ msg: "exito" });
    }).catch(cause => {
        console.error(cause);
        responseUtils.sendMsgCodeResponse(res, "Hubo un problema al crear las tablas", 500);
    });
};

function deleteTables() {
    return ShopDetails.deleteTable().then(() => {
        console.log("Se elimino la tabla de Shops details");
        return Shop.deleteTable();
    }).then(b => {
        console.log("Se elimino la tabla de Shops");
        return District.deleteTable();
    }).then(b => {
        console.log("Se elimino la tabla de Distritos");
        return ShopAdmin.deleteTable();
    }).then(b => {
        console.log("Se elimino la tabla de shop admins");
        return true;
    }).catch(cause => {
        console.error(cause);
    });
}

exports.deleteTestData = function (req, res) {
    deleteTables().then(b => {
        res.send({ msg: "exito" });
    }).catch(cause => {
        console.log("Hubo un problema al eliminar las tablas");
        responseUtils.sendMsgCodeResponse(res, "Hubo un problema al eliminar las tablas", 500);
    });
};