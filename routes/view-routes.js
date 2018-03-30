const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../config/main-config');
const logger = require('log4js').getLogger();


/* GET home page. */
router.get('/admin', (req, res) => {
    logger.debug('HEEEYYY');
    res.render('adminbackoffice', { title: 'HOY COMO' });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect(config.mainPath);
});

module.exports = router;
