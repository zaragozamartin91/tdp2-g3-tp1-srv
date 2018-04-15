const dbManager = require('./db-manager');
const Shop = require('./Shop');

const table = 'shop_schedule';
exports.table = table;

exports.createTable=function(){
    return dbManager.queryPromise(`CREATE TABLE ${table} (
        id SERIAL PRIMARY KEY,
        weekstart TIMESTAMP,
        weekfinish TIMESTAMP,
        weekendstart TIMESTAMP,
        weekendfinish TIMESTAMP,
        shopid int REFERENCES ${Shop.table}(id) ON DELETE CASCADE
    )`, []);
};

exports.deleteTable = function() {
    return dbManager.queryPromise('DROP TABLE ' + table, []);
};

exports.insert=function({weekstart, weekfinish, weekendstart, weekendfinish, shopid}){
    return dbManager.queryPromise(`
        INSERT INTO ${table}(weekstart, weekfinish, weekendstart, weekendfinish, shopid) 
        VALUES($1,$2,$3,$4,$5) 
        RETURNING *`, [weekstart, weekfinish, weekendstart, weekendfinish, shopid]);
};