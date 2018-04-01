const dbManager = require('./db-manager');

const table = 'shops';

function Shop(id , name) {
    this.id = id;
    this.name = name;
}

/**
 * Crea un Shop a partir de un OBJETO (no strin) json
 * @param {object} json Objeto a partir del cual crear el shop 
 */
function fromJson(json) {
    const {id , name} = json;
    return new Shop(id, name);
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
    //return dbManager.queryPromise(sql , [id] , fromRows);
    return null
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