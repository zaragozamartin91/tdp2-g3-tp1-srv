const axios = require('axios');

axios({
    url: 'http://localhost:5000/api/v1/admin/login',
    method: 'POST',
    headers: {
        Authorization: 'Basic aG95Y29tbzptaWxhbmVzYXM='
    }
})
    .then( res => console.log(res.data) )
    .catch(console.error);

