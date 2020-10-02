const express = require('express');
const router = express.Router();

const utils = require('../data/utils');
const middlwr_caching = require('../data/middlewares/caching_functions');
const category_controller = require('../controllers/category_controller');


router.get('/', middlwr_caching.caching_all_catg, category_controller.get_all_categories);


router.get('/:category_id', category_controller.get_catg_by_id);


router.get('/inProduct/:product_id', category_controller.get_catg_by_prod_id);


router.post('/', utils.verifyToken, category_controller.add_catg);


module.exports = router;



