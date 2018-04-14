const dbManager = require('./db-manager');

const table = 'shop_admins';
exports.table = table;

exports.createTable=function(){
    return dbManager.queryPromise(`CREATE TABLE ${table} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(64) NOT NULL,
        email VARCHAR(64) NOT NULL
    )`, []);
};

exports.deleteTable = function() {
    return dbManager.queryPromise('DROP TABLE ' + table, []);
};

exports.insert=function({name, email}){
    return dbManager.queryPromise(`
    INSERT INTO ${table}(name, email) 
    VALUES($1,$2) RETURNING *`, [name, email]);
};