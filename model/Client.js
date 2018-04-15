const dbManager = require('./db-manager');
const fs = require('fs');

const table = 'clients';
exports.table = table;

exports.createTable=function(){
    return dbManager.queryPromise(`CREATE TABLE ${table} (
        id VARCHAR(64) PRIMARY KEY,
        enabled BOOLEAN DEFAULT TRUE,
        address VARCHAR(64) NOT NULL,
        zone VARCHAR(64) NOT NULL
    )`, []);
};

exports.deleteTable = function() {
    return dbManager.queryPromise('DROP TABLE ' + table, []);
};

//No la exporto porque nadie deberia poder insertar nuevos valores por el momento 
function insert(id, address, zone){
    return dbManager.queryPromise(`
        INSERT INTO ${table}(id, address, zone) VALUES($1, $2, $3) RETURNING *`, [id, address, zone]);
}

exports.find = function () {
    return dbManager.queryPromise(`SELECT * FROM ${table}`, []);
};

exports.findById = function (id) {
    return dbManager.queryPromise(`SELECT * FROM ${table} WHERE id=$1`, [id]);
};