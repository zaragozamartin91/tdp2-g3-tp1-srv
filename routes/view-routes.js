const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../config/main-config');
const logger = require('log4js').getLogger();
const tokenManager = require('../utils/token-manager');


/* Backoffice de hoycomo */
router.get('/admin', (req, res) => {
    res.render('adminbackoffice', { title: 'HOY COMO' });
});

router.post('/admin/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin');
});

/* backoffice de comercios */
router.get('/shopadm', (req, res) => {
    res.render('shopbackoffice', { title: 'Administrar comercio' });
});

router.post('/shopadm/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/shopadm');
});


router.get('/shopreg', (req, res) => {
    //const tokenStr = req.params.token;
    const tokenStr = req.query.token;
    tokenManager.verifyToken(tokenStr, (err, decoded) => {
        if(err) res.render('error',{message: 'Token invalido' , error:err});

        const { shopId, shopName } = decoded;
        //res.redirect('/shopreg');
        res.render('shopreg', { title: 'Registrar comercio', shopId, shopName });
    });
});

module.exports = router;
