const express = require('express');
const router = express.Router();

const utils = require('../data/utils');
const order_controller = require('../controllers/order_controller');



router.post('/from_cart', utils.verifyToken, order_controller.buy_from_cart );


router.post('/from_products', utils.verifyToken, order_controller.buy_from_prod );


router.get('/inCustomer', utils.verifyToken, order_controller.get_all_orders_of_cust );


router.get('/:order_id', order_controller.get_order_by_id );



module.exports = router;