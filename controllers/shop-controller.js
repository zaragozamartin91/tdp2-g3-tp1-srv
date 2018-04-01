exports.getShops = function (req, res) {
    // TODO : LLAMAR AL MODELO DE SHOPS
    const shops = [
        { id:1 , name: 'mercadito', address: 'Sto domingo 1180', zone: 'Martinez', phone: '123', enabled: true }
    ];
    res.send({ shops });
};