const assert = require('assert');

function mockErrRes(expectedCode) {
    const res = {
        status(code) { this.code = code; },
        send({ code, message }) {
            assert.ok(message);
            assert.equal(expectedCode, code);
            //sinon.assert.match(code, expectedCode);
        }
    };
    return res;
}

exports.mockErrRes = mockErrRes;
