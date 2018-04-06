const basicAuthParser = require('../utils/basic-auth-parser');
const tokenManager = require('../utils/token-manager');
const mainConf = require('../config/main-config');
const responseUtils = require('../utils/response-utils');


exports.login = function (req, res) {
    const basicAuth = basicAuthParser.parse(req);
    const username = req.body.username || basicAuth.user;
    const password = req.body.password || basicAuth.pass;

    console.log({ username, password });

    const shopStub = {
        "id": 3,
        "name": "Pizzeria la mas rica 2",
        "address": "Calle falsa 909",
        "phone": "Caballito",
        "zone": "1212121233",
        "enabled": true
    };

    if (verifyLogin(username, password)) {
        const token = signShop(shopStub);

        const expires = new Date(Date.now() + 1000 * 60 * 15);
        res.cookie('token', token.token, { expires });

        const version = mainConf.apiVersion;
        const metadata = { version };
        return res.send({ metadata, token, shop: shopStub });
    } else {
        responseUtils.sendMsgCodeResponse(res, 'Credenciales invalidas', 401);
    }
};

// TODO
function verifyLogin(username, password) {
    return true;
}

//TODO
function signShop({ id, name }) {
    return tokenManager.signToken({ id, name });
}