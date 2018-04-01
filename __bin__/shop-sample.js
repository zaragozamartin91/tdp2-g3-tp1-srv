const Shop = require("../model/Shop");
const dbManager = require("../model/db-manager");

//Shop.createTable();


Shop.insert({name: "mercadoArg", address: "Falsa 345", phone: "111111111", zone: "Palermo"})
    .then( ([shop]) => {
        console.log(`shop ${shop.id} creado`);
        console.log(shop);
        return Shop.deleteById(shop.id);
    })
    .then( ([shop]) => {
        console.log(`shop ${shop.id} eliminado`);
    })
    .catch(cause => {
        console.error(cause);
    })

/*
    
Shop.deleteById(1)
    .then(shops => {
        console.log("Se elimino el registro");
    })
    .catch(cause => {
        console.error(cause);
    })

*/
