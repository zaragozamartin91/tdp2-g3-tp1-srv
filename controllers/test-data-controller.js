const dbManager = require('../model/db-manager');
const moment = require('moment');
const responseUtils = require('../utils/response-utils');
const logger = require('log4js').getLogger('test-data-controller');

const Shop = require('../model/Shop');

createTables = function () {
    return Shop.createTable().then(() => {
        console.log("Se creo la tabla de Shops");
        return true;
    })
}

exports.createTestData = function (req, res) {
    createTables().then(b => {
        res.send({msg: "exito"});
    }).catch( cause => {
        console.log("Hubo un problema al crear las tablas");
        responseUtils.sendMsgCodeResponse(res , "Hubo un problema al crear las tablas", 500);
    })
};

deleteTables = function () {
    return Shop.deleteTable().then(() => {
        console.log("Se elimino la tabla de Shops");
        return true;
    })
}

exports.deleteTestData = function (req, res) {
    deleteTables().then(b => {
        res.send({msg: "exito"});
    }).catch( cause => {
        console.log("Hubo un problema al eliminar las tablas");
        responseUtils.sendMsgCodeResponse(res , "Hubo un problema al eliminar las tablas", 500);
    })
};