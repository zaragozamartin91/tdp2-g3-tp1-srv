const dbManager = require('./db-manager');
const fs = require('fs');

const table = 'food_types';
exports.table = table;

exports.createTable=function(){
    return dbManager.queryPromise(`CREATE TABLE ${table} (
        id SERIAL PRIMARY KEY,
        foodtype VARCHAR(64) NOT NULL
    )`, []);
};

exports.deleteTable = function() {
    return dbManager.queryPromise('DROP TABLE ' + table, []);
};

//No la exporto porque nadie deberia poder insertar nuevos valores por el momento
function insert(foodtype){
    return dbManager.queryPromise(`
        INSERT INTO ${table}(foodtype) VALUES($1) RETURNING *`, [foodtype]);
}

exports.insertDefaults = function () {
    const contents = fs.readFileSync('jsons/foodtypes.json');
    const jsonContent = JSON.parse(contents);
    const promises = [];
    jsonContent.forEach(foodtype => promises.push(insert(foodtype)));
    return Promise.all(promises);
};

exports.find = function () {
    return dbManager.queryPromise(`SELECT * FROM ${table}`, []);
};

exports.findByName = function (name) {
    return dbManager.queryPromise(`SELECT * FROM ${table} WHERE foodtype=$1`, [name]);
};