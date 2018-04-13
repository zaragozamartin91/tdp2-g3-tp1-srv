const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../config/main-config');
const logger = require('log4js').getLogger();


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

module.exports = router;
