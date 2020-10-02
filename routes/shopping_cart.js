const express = require('express');
const router = express.Router();

const utils = require('../data/utils');
const cart_controller = require('../controllers/shopping_cart_controller');



router.get('/', utils.verifyToken, cart_controller.get_prod_in_cart );


router.get('/totalAmount', utils.verifyToken, cart_controller.total_amt_of_cart );


router.post('/add', utils.verifyToken, cart_controller.add_to_cart );


router.put('/update/:product_id', utils.verifyToken, cart_controller.update_prod_qty_in_cart );


router.delete('/empty', utils.verifyToken, cart_controller.empty_cart);


router.delete('/removeProduct/:product_id', utils.verifyToken, cart_controller.remove_a_prod_from_cart);



module.exports = router;