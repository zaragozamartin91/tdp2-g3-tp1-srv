const dbManager = require('./db-manager');

const table = 'shops';
const idType = 'SERIAL'

function Shop(id , name, address, zone, phone) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.phone = phone
    this.zone = zone;
}

Shop.createTable = function () {
    const sql = `CREATE TABLE ${table} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(64),
        address VARCHAR(64),
        phone VARCHAR(32),
        zone VARCHAR(64)
    )`;
    return dbManager.queryPromise(sql,[]);
}

Shop.insert = function(json) {
    const {name, address, phon, zone} = json;
    const sql = `INSERT INTO ${table}(name, address, phone, zone) VALUES($1,$2,$3,$4) RETURNING *`;
    const values = [name, address, phone, zone];
    return dbManager.queryPromise(sql, values, fromRows);
}

/**
 * Crea un Shop a partir de un OBJETO (no strin) json
 * @param {object} json Objeto a partir del cual crear el shop 
 */
function fromJson(json) {
    const {id , name, address, phone, zone} = json;
    return new Shop(id, name, address, phone, zone);
}

function fromRows(rows) {
    return rows.map( fromJson );
}

Shop.findById = function(shop) {
    /* esta expresion determina que si shop tiene un atributo id (xq es un objeto) 
    entonces asigna a la variable id el valor de dicho atributo.
    Caso contrario, interpreto a shop como un numero y lo asigno a id.
    nota: esto vale si y solo si el operando de la izquierda no es "falsy" por efecto colateral */
    const id = shop.id || shop;
    const sql = `SELECT * FROM ${table} WHERE id=$1`;
    return dbManager.queryPromise(sql , [id] , fromRows);
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