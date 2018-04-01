const basicAuthParser = require('../utils/basic-auth-parser');
const tokenManager = require('../utils/token-manager');
const mainConf = require('../config/main-config');
const responseUtils = require('../utils/response-utils');


exports.login = function (req, res) {
    const basicAuth = basicAuthParser.parse(req);
    const username = req.body.username || basicAuth.user;
    const password = req.body.password || basicAuth.pass;

    console.log({ username, password });

    if (verifyLogin(username, password)) {
        const token = signUser(username);

        const expires = new Date(Date.now() + 1000 * 60 * 15);
        res.cookie('token', token.token, { expires });

        const version = mainConf.apiVersion;
        const metadata = { version };
        return res.send({ metadata, token });
    } else {
        responseUtils.sendMsgCodeResponse(res, 'Credenciales invalidas', 401);
    }
};

function verifyLogin(username, password) {
    return username == 'hoycomo' && password == 'milanesas';
}

function signUser(user) {
    const id = user.id;
    const username = user.username;
    return tokenManager.signToken({ id, username });
}
