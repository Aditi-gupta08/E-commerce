const express = require('express');
const { to } = require('await-to-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const joi = require('joi');
const router = express.Router();

const models = require('../lib/database/mysql/index');
const utils = require('../data/utils');
const joi_validtn = require('../data/joi');
const order_services = require('../services/orders');
const customer_services = require('../services/customers');



// Get customer details
router.get('/', utils.verifyToken, async (req, res) => {
  
    let {id} = res.cur_customer;
    let [err, serv] = await to(customer_services.get_cust_details(id));
    if(err)
        return res.json({ data: null, error: err});
    
    let [error, CUSTOMERS] = serv;
    if(error)
        return res.json({ data: null, error});

    return res.send({ data: CUSTOMERS, error: null});
});





// Signup a customer
router.post('/', async(req, res) => {

    // Validation
    let validated = await joi_validtn.vldt_signup.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });

  
    let [err, created] = await to(customer_services.signup(req.body));
    if(err)
        return res.json({ data: null, error: err});

    if(!created)
        return res.json({ data: null, error: "A customer with this email alreasy exists !"});
  
    return res.json({ data: "Customer signed up successfully !", error: null});

});




// Update a customer
router.put('/', utils.verifyToken, async(req, res) => {

    // Validation 
    let validated = await joi_validtn.vldt_update_info.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });

    
    let customer = res.cur_customer;
    let [err, cnt] = await to(customer_services.update_cust(req.body, customer.id));
    if(err)
        return res.json({ data: null, error: err});
    
    return res.json({ data: "Info updated successfully!!"});

});




router.post('/login', async(req, res) => {

    // Validation 
    let validated = await joi_validtn.vldt_login.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });


    let [err, serv] = await to(customer_services.login(req.body));
    if(err)
        return res.json({ data: null, error: err});


    let [error, newCustomer] = serv;
    if(error)
        return res.json({ data: null, error});


    // Creating customer's token
    jwt.sign( { newCustomer }, 'secretkey', async (error, token) => {

        if(error)
            return res.json({ data: null, "error": "Error in assigning token" });

        await models.customerModel.update({ login_status: true }, {
            where: { email: newCustomer.email }
        });

        return res.json({
            "accessToken" : token,
            "error": null
        });
    }); 

});



router.put('/logout', utils.verifyToken, async (req, res) => {

    let [err, cnt] = await to(customer_services.update_phone_no( res.cur_customer.email));
    if(err)
        return res.json({ data: null, error: err});

    return res.json({ data: "Logged out succesfully !!", error: null});
 
});




router.put( '/phoneNo', utils.verifyToken, async(req, res) => {

    // Validation 
    let validated = await joi_validtn.vldt_c_phone_no.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: "Invalid phone no!! Phone no must be of 10 digits"});


    let [err, cnt] = await to(customer_services.update_phone_no( req.body.phone_no, res.cur_customer.id));
    if(err)
        return res.json({ data: null, error: err});
    
    return res.json({ data: "Phone no updated successfully!!"});

});




router.put( '/creditCard', utils.verifyToken, async(req, res) => {

    // Validation 
    let validated = await joi_validtn.vldt_c_credit_no.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });


    let cc_no = req.body.credit_card_no;
    let [err, cnt] = await to(customer_services.update_credit_card_no(cc_no, res.cur_customer.id));
    if(err)
        return res.json({ data: null, error: err});

    return res.json({ data: "Credit card no updated successfully!!"});

});




router.put( '/address', utils.verifyToken, async(req, res) => {

    // Validation 
    let validated = await joi_validtn.vldt_c_address.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });


    let [err, cnt] = await to(customer_services.update_addr(req.body, res.cur_customer.id));
    if(err)
        return res.json({ data: null, error: err});

    return res.json({ data: "Address updated successfully!!", error: null});

});


router.get( '/try', utils.verifyToken, (req, res) => {
    return res.send("tryy");
})

module.exports = router;
