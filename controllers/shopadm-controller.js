const basicAuthParser = require('../utils/basic-auth-parser');
const tokenManager = require('../utils/token-manager');
const mainConf = require('../config/main-config');
const responseUtils = require('../utils/response-utils');
const Shop = require('../model/Shop');


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

exports.getMyShop = function (req, res) {
    const { id = 0, name } = req.decodedToken;
    Shop.findById(id).then(([shop]) => {
        if (shop) return res.send({ shop });
        else return Promise.reject({ code: 460, message: 'El shop no existe' });
    }).catch(cause => {
        const { code, message } = cause;
        console.error(cause);
        res.status(code || 500);
        res.send(cause);
    });
};