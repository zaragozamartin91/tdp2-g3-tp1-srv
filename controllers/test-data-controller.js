const dbManager = require('../model/db-manager');
const moment = require('moment');
const responseUtils = require('../utils/response-utils');
const logger = require('log4js').getLogger('test-data-controller');

const Shop = require('../model/Shop');

function createTables() {
    return Shop.createTable().then(() => {
        console.log("Se creo la tabla de Shops");
        return true;
    });
}

function insertShops() {
    const pr = [];
    for (let shopi = 0; shopi < 3; shopi++) {
        pr.push(Shop.insert({
            name: 'shop_' + shopi,
            phone: '445567890',
            address: 'address_' + shopi,
            zone: 'zone_' + shopi
        }));
    }
    return Promise.all(pr);
}

exports.createTestData = function (req, res) {
    createTables().then(b => {
        console.log('Tabla de shops creada');
        return insertShops();
    }).then(b => {
        console.log('Shops insertados');
        res.send({ msg: "exito" });
    }).catch(cause => {
        console.log("Hubo un problema al crear las tablas");
        responseUtils.sendMsgCodeResponse(res, "Hubo un problema al crear las tablas", 500);
    });
};


function deleteTables() {
    return Shop.deleteTable().then(() => {
        console.log("Se elimino la tabla de Shops");
        return true;
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