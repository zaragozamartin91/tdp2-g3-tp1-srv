const express = require('express');
const tokenController = require('../controllers/token-controller');
const tokenValidator = require('../middleware/token-validator');

const testDataController = require('../controllers/test-data-controller');

//NUEVOS CONTROLADORES ------------------------------------------------
const adminController = require('../controllers/admin-controller');
const shopController = require('../controllers/shop-controller');

const router = express.Router();

router.post('/admin/login', adminController.login);

//TODO : AGREGAR SEGURIDAD A NIVEL TOKEN

/* Endpoints para obtener y dar de alta shops. Solo accessibles para el administrador */
router.get('/shops', tokenValidator.verifyToken, tokenValidator.verifyAdminToken, shopController.getShops);
router.post('/shops', tokenValidator.verifyToken, tokenValidator.verifyAdminToken, shopController.createShop);
router.put('/shops/:shopId', tokenValidator.verifyToken, tokenValidator.verifyAdminToken, shopController.updateShop);

router.get('/shops/:shopId/menu' , shopController.getShopMenu);

router.get('/shops/enabled', shopController.getShopsEnabled);
//router.delete('/shops/:shopId', shopController.deleteShop);

module.exports = router;

/* CREA LOS DATOS DE PRUEBA DE LA APP */
router.post('/test-data', testDataController.createTestData);
router.delete('/test-data', testDataController.deleteTestData);
