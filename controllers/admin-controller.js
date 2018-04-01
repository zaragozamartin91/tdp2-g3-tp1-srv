const basicAuthParser = require('../utils/basic-auth-parser');
const tokenManager = require('../utils/token-manager');
const mainConf = require('../config/main-config');

function signUser(user) {
    const id = user.id;
    const username = user.username;
    return tokenManager.signToken({ id, username });
}

exports.login = function (req, res) {
    const basicAuth = basicAuthParser.parse(req);
    const username = req.body.username || basicAuth.user;
    const password = req.body.password || basicAuth.pass;

    console.log({username , password});

    const token = signUser(username);

    const expires = new Date(Date.now() + 1000 * 60 * 15);
    res.cookie('token', token.token, { expires });

    const version = mainConf.apiVersion;
    const metadata = { version };

    return res.send({ metadata, token });
};