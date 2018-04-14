const dbManager = require('./db-manager');
const ShopAdmin = require('./ShopAdmin');

const table = 'shops';
const idType = 'SERIAL'

function Shop(id, name, address, phone, zone, enabled, lat, long, adminid) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.phone = phone
    this.zone = zone;
    this.enabled = enabled;
    this.lat = lat;
    this.long = long;
    this.adminid = adminid;
}

Shop.createTable = function () {
    const sql = `CREATE TABLE ${table} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(64) NOT NULL,
        address VARCHAR(64) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        zone VARCHAR(64) NOT NULL,
        enabled BOOLEAN DEFAULT FALSE,
        lat VARCHAR(64) NOT NULL,
        long VARCHAR(64) NOT NULL,
        adminid int REFERENCES ${ShopAdmin.table}(id) ON DELETE CASCADE
    )`;
    return dbManager.queryPromise(sql, []);
}

Shop.deleteTable = function () {
    const sql = `DROP TABLE  ${table}`;
    return dbManager.queryPromise(sql, []);
}

Shop.insert = function (json) {
    const { name, address, phone, zone, lat, long, adminid } = json;

    const sql = `INSERT INTO ${table}(name, address, phone, zone, lat, long, adminid) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const values = [name, address, phone, zone, lat, long, adminid];
    return dbManager.queryPromise(sql, values, fromRows);
}

Shop.update = function (json) {
    const { id, name, address, phone, zone, lat, long, adminid } = json;
    const sql = `UPDATE ${table} SET name=$1, address=$2, phone=$3, zone=$4, lat=$5, long=$6, adminid=$7 WHERE id=$8 RETURNING *`;
    const values = [name, address, phone, zone, lat, long, adminid, id];
    return dbManager.queryPromise(sql, values, fromRows);
};

Shop.setEnabled = function (json) {
    const { id, enabled } = json;
    const sql = `UPDATE ${table} SET enabled=$1 WHERE id=$2 RETURNING *`;
    const values = [enabled, id];
    return dbManager.queryPromise(sql, values, fromRows);
};

Shop.deleteById = function (shop) {
    const id = shop.id || shop;
    const sql = `DELETE FROM ${table} WHERE id=$1 RETURNING *`;
    return dbManager.queryPromise(sql, [id], fromRows);
};

/**
 * Crea un Shop a partir de un OBJETO (no strin) json
 * @param {object} json Objeto a partir del cual crear el shop 
 */
function fromJson(json) {
    const { id, name, address, phone, zone, enabled = true, lat, long, adminid } = json;
    return new Shop(id, name, address, phone, zone, enabled, lat, long, adminid);
}

function fromRows(rows) {
    return rows.map(fromJson);
}

Shop.fromRows = fromRows;

Shop.findById = function (shop) {
    /* esta expresion determina que si shop tiene un atributo id (xq es un objeto) 
    entonces asigna a la variable id el valor de dicho atributo.
    Caso contrario, interpreto a shop como un numero y lo asigno a id.
    nota: esto vale si y solo si el operando de la izquierda no es "falsy" por efecto colateral */
    const id = shop.id || shop;
    const sql = `SELECT * FROM ${table} WHERE id=$1`;
    return dbManager.queryPromise(sql, [id], fromRows);
};

Shop.find = function () {
    const sql = `SELECT * FROM ${table}`;
    return dbManager.queryPromise(sql, [], fromRows);
};

Shop.findEnabled = function () {
    const sql = `SELECT * FROM ${table} WHERE enabled = TRUE`;
    return dbManager.queryPromise(sql, [], fromRows);
};

// EJEMPLO de llamada a findById
//Shop.findById(123)
//    .then(shops => {
//        // hacer cosas con los shops
//    })
//    .catch(cause => {
//        // hacer cosas con el error
//    })


//esto indica que TODA la clase Shop sera exportada
module.exports = Shop; 