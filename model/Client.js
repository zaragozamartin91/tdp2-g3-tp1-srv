const dbManager = require('./db-manager');
const fs = require('fs');

const table = 'clients';
exports.table = table;

exports.createTable=function(){
    return dbManager.queryPromise(`CREATE TABLE ${table} (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(64) NOT NULL,
        enabled BOOLEAN DEFAULT TRUE,
        address VARCHAR(64) NOT NULL,
        zone VARCHAR(64) NOT NULL
    )`, []);
};

exports.deleteTable = function() {
    return dbManager.queryPromise('DROP TABLE ' + table, []);
};

exports.insert = function({id, email, address, zone}){
    return dbManager.queryPromise(`
        INSERT INTO ${table}(id, email, address, zone) VALUES($1, $2, $3, $4) RETURNING *`, [id, email, address, zone]);
};

exports.find = function () {
    return dbManager.queryPromise(`SELECT * FROM ${table}`, []);
};

exports.findById = function (id) {
    return dbManager.queryPromise(`SELECT * FROM ${table} WHERE id=$1`, [id]);
};