const express = require('express');
const router = express.Router();

const utils = require('../data/utils');
const customer_controller = require('../controllers/customer_controller');



router.get('/', utils.verifyToken, customer_controller.get_cust_details);


router.post('/', customer_controller.signup );


router.put('/', utils.verifyToken, customer_controller.update_cust_details);


router.get('/login', customer_controller.login);


router.put('/logout', utils.verifyToken, customer_controller.logout);


router.put( '/phoneNo', utils.verifyToken, customer_controller.update_phone_no );


router.put( '/creditCard', utils.verifyToken, customer_controller.update_credit_card_no);


router.put( '/address', utils.verifyToken, customer_controller.update_address );



module.exports = router;
