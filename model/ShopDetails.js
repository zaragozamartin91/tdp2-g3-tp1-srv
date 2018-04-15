const dbManager = require('./db-manager');

const Shop = require('./Shop');
const FoodType = require('./FoodType');

const table = 'shop_details';
exports.table = table;

exports.createTable=function(){
    return dbManager.queryPromise(`CREATE TABLE ${table} (
        id SERIAL PRIMARY KEY,
        foodtype int REFERENCES ${FoodType.table}(id) NOT NULL,
        shop int REFERENCES ${Shop.table}(id) ON DELETE CASCADE
    )`, []);
};

exports.deleteTable = function() {
    return dbManager.queryPromise('DROP TABLE ' + table, []);
};

exports.insert=function({foodtype, shop}){
    return dbManager.queryPromise(`
    INSERT INTO ${table}(foodtype, shop) 
    VALUES($1,$2) RETURNING *`, [foodtype, shop]);
};

exports.findById = function (shopid) {
    return dbManager.queryPromise(`SELECT * FROM ${table} WHERE shopid=$1`, [shopid]);
};