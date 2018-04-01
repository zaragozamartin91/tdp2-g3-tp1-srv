const Shop = require("../model/Shop");

Shop.insert({name: "mercadoArg", address: "Falsa 345", phone: "111111111"})
    .then(shops => {
        console.log("Shop insertado:");
        console.log(shops);
    })
    .catch(cause => {
        console.error(cause);
    })