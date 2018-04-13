const axios = require('axios');

axios({
    url: 'http://localhost:5000/api/v1/admin/login',
    method: 'POST',
    headers: {
        Authorization: 'Basic aG95Y29tbzptaWxhbmVzYXM='
    }
})
    .then(res => {
        const tokenv = res.data.token.token;
        return axios({
            url: 'http://localhost:5000/api/v1/shops',
            method: 'GET',
            headers: { Authorization: 'Bearer ' + tokenv }
        });
    })
    .catch(console.error);
