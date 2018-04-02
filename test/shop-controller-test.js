const assert = require('assert');
const sinon = require('sinon');
const testUtils = require('./test-utils');

const shopController = require('../controllers/shop-controller');
const Shop = require('../model/Shop');

/* mock respuesta de insert */
const insertedShops1 = Shop.fromRows([
    {
        "id": 3,
        "name": "Pizzeria la mas rica 2",
        "address": "Calle falsa 909",
        "phone": "Caballito",
        "zone": "1212121233",
        "enabled": true
    }
]);

/* mock de request de shopController#createShop */
const createShopReq1 = {
    body: {
        "name": "Pizzeria la mas rica 2",
        "address": "Calle falsa 909",
        "phone": "1212121233",
        "zone": "Caballito"
    }
};


/* mock respuesta de gets */
const getShops = Shop.fromRows([
    {
        "id": 3,
        "name": "Pizzeria la mas rica 2",
        "address": "Calle falsa 909",
        "phone": "Caballito",
        "zone": "1212121233",
        "enabled": true
    },
    {
        "id": 4,
        "name": "Pizzeria la mas rica",
        "address": "Calle falsa 1009",
        "phone": "Palermo",
        "zone": "1333444455",
        "enabled": false
    }
]);

/* mock de request de shopController#createShop */
const getShopsReq = {
    body: {
        shops: [
            {
                "id": 3,
                "name": "Pizzeria la mas rica 2",
                "address": "Calle falsa 909",
                "phone": "Caballito",
                "zone": "1212121233",
                "enabled": true
            },
            {
                "id": 4,
                "name": "Pizzeria la mas rica",
                "address": "Calle falsa 1009",
                "phone": "Palermo",
                "zone": "1333444455",
                "enabled": false
            }
        ]
    }
};

const getShopsEmpty = Shop.fromRows([]);

const getShopsEmptyReq = {
    body: {
        shops: []
    }
};

let sandbox = null;
describe('shop-controller', function () {
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('#createShop', function () {
        it('Falla porque hubo un error an la BBDD', function (done) {
            /* Hacemos que el insert de Shop falle con una promesa fallida */
            sandbox.stub(Shop, 'insert').rejects();

            const req = createShopReq1;
            /* Creamos una response mock que verifique el codigo de error 500 */
            const res = testUtils.mockErrRes(500);

            /* LLamamos a createShop (el cual devuelve una promsesa) y que el 
            test termine cuando el metodo se resuelva (pasando como callback de 
            'then' y 'catch' el valor 'done') */
            shopController.createShop(req, res)
                .then(done)
                .catch(done);
        });

        it('Inserta un elemento en la BBDD', function (done) {
            /* Hacemos que el insert de Shop sea exitoso y que devuelva
            el arreglo 'insertedShops1' */
            sandbox.stub(Shop, 'insert').resolves(insertedShops1);
            
            /* creamos un response mock con un metodo 'send' que verifique
            que la respuesta enviada contenga un campo 'shop' que coincida con
            el primer elemento del arreglo de la respuesta del 'insert' */
            const res = {
                send(json) {
                    assert.equal(json.shop , insertedShops1[0]);
                }
            }
            shopController.createShop(createShopReq1 , res)
                .then(done)
                .catch(done);
        });
    });

    describe('#getShops', function () {
        it('Falla porque hubo un error an la BBDD', function (done) {
            /* Hacemos que el insert de
             Shop falle con una promesa fallida */
            sandbox.stub(Shop, 'find').rejects();

            const req = getShopsReq;
            /* Creamos una response mock que verifique el codigo de error 500 */
            const res = testUtils.mockErrRes(500);

            /* LLamamos a createShop (el cual devuelve una promsesa) y que el 
            test termine cuando el metodo se resuelva (pasando como callback de 
            'then' y 'catch' el valor 'done') */
            shopController.getShops(req, res)
                .then(done)
                .catch(done);
        });

        it('Obtener el listado de shops en la BBDD', function (done) {
            /* Hacemos que el get de Shop sea exitoso y que devuelva
            el arreglo 'getShops' */
            sandbox.stub(Shop, 'find').resolves(getShops);
            
            /* creamos un response mock con un metodo 'send' que verifique
            que la respuesta enviada contenga un campo 'shop' que coincida con
            el primer elemento del arreglo de la respuesta del 'insert' */
            const res = {
                send(json) {
                    assert.equal(json.shops , getShops);
                }
            }
            shopController.getShops(getShopsReq , res)
                .then(done)
                .catch(done);
        });

        it('Obtener el listado de shops en la BBDD cuando no hay shops', function (done) {
            /* Hacemos que el get de Shop sea exitoso y que devuelva
            el arreglo 'getShops' */
            sandbox.stub(Shop, 'find').resolves(getShopsEmpty);
            
            /* creamos un response mock con un metodo 'send' que verifique
            que la respuesta enviada contenga un campo 'shop' que coincida con
            el primer elemento del arreglo de la respuesta del 'insert' */
            const res = {
                send(json) {
                    assert.equal(json.shops , getShopsEmpty);
                }
            }
            shopController.getShops(getShopsEmptyReq , res)
                .then(done)
                .catch(done);
        });
    });

});


