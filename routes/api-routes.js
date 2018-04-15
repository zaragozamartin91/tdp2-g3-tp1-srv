const express = require('express');
const tokenController = require('../controllers/token-controller');
const tokenValidator = require('../middleware/token-validator');

const testDataController = require('../controllers/test-data-controller');

//NUEVOS CONTROLADORES ------------------------------------------------
const adminController = require('../controllers/admin-controller');
const shopController = require('../controllers/shop-controller');
const shopadmController = require('../controllers/shopadm-controller');
const foodTypeController = require('../controllers/foodtype-controller');

const router = express.Router();

router.post('/admin/login', adminController.login);
router.get('/districts', adminController.getDistricts);

//TODO : AGREGAR SEGURIDAD A NIVEL TOKEN

/* Endpoints para obtener y dar de alta shops. Solo accessibles para el administrador */
router.get('/shops', shopController.getShops);
router.post('/shops', tokenValidator.verifyToken, tokenValidator.verifyAdminToken, shopController.createShop);
router.put('/shops/:shopId', tokenValidator.verifyToken, tokenValidator.verifyAdminToken, shopController.updateShop);

router.get('/shops/:shopId/menu', shopController.getShopMenu);

router.get('/shops/enabled', shopController.getShopsEnabled);
//router.delete('/shops/:shopId', shopController.deleteShop);

/* Endpoints para los tipos de comidas*/
router.get('/foodtypes', foodTypeController.getFoodTypes);

/* Login para el backoffice de comercios */
router.post('/shopadm/login', shopadmController.login);
router.get('/shopadm/myshop', tokenValidator.verifyToken, shopadmController.getMyShop);
router.post('/shopadm/verify', tokenValidator.verifyToken, shopadmController.verifyShop);

/* CREA LOS DATOS DE PRUEBA DE LA APP */
router.post('/test-data', testDataController.createTestData);
router.delete('/test-data', testDataController.deleteTestData);


module.exports = router;