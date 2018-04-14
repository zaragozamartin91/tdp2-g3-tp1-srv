const dbManager = require('./db-manager');

const Shop = require('./Shop');

const table = 'shop_details';
exports.table = table;

exports.createTable=function(){
    return dbManager.queryPromise(`CREATE TABLE ${table} (
        id SERIAL PRIMARY KEY,
        foodtype VARCHAR(64) NOT NULL,
        shopid int REFERENCES ${Shop.table}(id) ON DELETE CASCADE
    )`, []);
};

exports.deleteTable = function() {
    return dbManager.queryPromise('DROP TABLE ' + table, []);
};

exports.insert=function({foodtype, shopid}){
    return dbManager.queryPromise(`
    INSERT INTO ${table}(foodtype, shopid) 
    VALUES($1,$2) RETURNING *`, [foodtype, shopid]);
};