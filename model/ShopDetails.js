const dbManager = require('./db-manager');

const Shop = require('./Shop');
const FoodType = require('./FoodType');

const table = 'shop_details';
exports.table = table;

exports.createTable=function(){
    return dbManager.queryPromise(`CREATE TABLE ${table} (
        id SERIAL PRIMARY KEY,
        foodtypeid int REFERENCES ${FoodType.table}(id) NOT NULL,
        shopid int REFERENCES ${Shop.table}(id) ON DELETE CASCADE
    )`, []);
};

exports.deleteTable = function() {
    return dbManager.queryPromise('DROP TABLE ' + table, []);
};

exports.insert=function({foodtypeid, shopid}){
    return dbManager.queryPromise(`
    INSERT INTO ${table}(foodtypeid, shopid) 
    VALUES($1,$2) RETURNING *`, [foodtypeid, shopid]);
};

exports.findById = function (shopid) {
    return dbManager.queryPromise(`SELECT * FROM ${table} WHERE shopid=$1`, [shopid]);
};

exports.find = function () {
    return dbManager.queryPromise(`SELECT * FROM ${table} `, []);
};