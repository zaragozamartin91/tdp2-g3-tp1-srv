const dbManager = require('./db-manager');
const fs = require('fs');

const table = 'districts';
exports.table = table;

exports.createTable = function () {
    return dbManager.queryPromise(`CREATE TABLE ${table}(
        id SERIAL PRIMARY KEY,
        name VARCHAR(64)
    )`, []);
};

exports.deleteTable = function () {
    return dbManager.queryPromise(`DROP TABLE ${table}`, []);
};

exports.insert = function (name) {
    return dbManager.queryPromise(
        `INSERT INTO ${table}(name) VALUES($1) RETURNING *`, [name]);
};

exports.insertDefaults = function () {
    const contents = fs.readFileSync('jsons/districts.json');
    const jsonContent = JSON.parse(contents);
    const promises = [];
    jsonContent.forEach(districtName => promises.push(exports.insert(districtName)));
    return Promise.all(promises);
};

exports.find = function () {
    return dbManager.queryPromise(`SELECT * FROM ${table}`, []);
};

exports.findByName = function (name) {
    return dbManager.queryPromise(`SELECT * FROM ${table} WHERE name=$1`, [name]);
};