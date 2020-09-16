const express = require('express');
const router = express.Router();
const models = require('../lib/database/mysql/index');
const { to } = require('await-to-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const utils = require('../data/utils');
const joi = require('joi');


// Get all customers
router.get('/', utils.verifyToken, async (req, res) => {
  
    let {id} = res.cur_customer;
    let [err, CUSTOMERS] = await to(models.customerModel.findAll({
        where: { id: id}
    }));

    if(err)
        return res.json({ data: null, error: err});

    return res.send({ data: CUSTOMERS, error: null});
});


// Signup a customer
router.post('/', async(req, res) => {

    // Validation
    let validated = await utils.vldt_signup.validate(req.body);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    }

    let customer_payload = req.body;

    // Encrypting password
    const [tmp, encrypted_pass] = await to( utils.passwordHash( customer_payload.password));
    console.log(tmp);
    if(tmp)
        return res.json({ data: null, error: "Error in encrypting password", tmp});

    // find customer or create new one
    const [ customer, created] = await models.customerModel.findOrCreate({
        where: { email: customer_payload.email },
        defaults: {
            name: customer_payload.name,
            email: customer_payload.email,
            encrypted_pass: encrypted_pass,
            login_status: false
        }
    });
  
    if(!created)
        return res.json({ data: null, error: "A customer with this email alreasy exists !"});
  
    return res.json({ data: "Customer signed up successfully !", error: null});

});



/* 

// Update a customer
router.put('/', utils.verifyToken, async(req, res) => {

    // Validation 
    let validated = await utils.vldt_login.validate(req.body);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    }

    let customer = res.cur_customer;
    let { name, phone_no, credit_card_no, addr1, addr2, city, region, postal_code, country} = req.body;

    let [tmp, count] = await to(models.customerModel.update(
        { 
            name,
            phone_no, 
            credit_card_no,
            addr1,
            addr2,
            city,
            region,
            postal_code,
            country
        }, 
        {
            where: {
                id: customer.id
            }
        }
    ));

});
 */




// Login a customer
router.post('/login', async(req, res) => {

    // Validation 
    let validated = await utils.vldt_login.validate(req.body);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    }

    // Checking if customer isn't signed up or already logged in
    let payload_customer = req.body;

    let [err, CUSTOMER ] = await to(models.customerModel.findOne({ 
        where: {
          email: payload_customer.email
        }
    }));
    
    if(err)
        return res.json({data: null, error: "Some error occured in fetching data!"});
    
    if( CUSTOMER == null )
        return res.json({ data: null, error: "No customer found with this email!"});

    let customer = CUSTOMER.dataValues;
    //console.log(customer);

    if( customer.login_status == true)
        return res.json({ data: null, error: "User is already logged in!"});

    
    const newCustomer = {
        id: customer.id,
        name: customer.name,
        email: customer.email
    } 
    

    // Checking password
    let [error, isValid] = await to( bcrypt.compare( payload_customer.password, customer.encrypted_pass) )

    if(error){
        return res.json({ data: null, error: "Some error occured in comparing password"});
    }

    if(!isValid){
        return res.json({ data: null, error: "Incorrect Password !"});
    }

    // Creating customer's token

    jwt.sign( { newCustomer }, 'secretkey', async (error, token) => {

        if(error)
            return res.json({ data: null, "error": "Error in assigning token" });


        // Updating login_status to true
        await models.customerModel.update({ login_status: true }, {
            where: {
              email: newCustomer.email
            }
        });

        return res.json({
            "accessToken" : token,
            "error": null
        });
    }); 

});


// Logout
router.put('/logout', utils.verifyToken, async (req, res) => {

    let {email} = res.cur_customer;
    //let {email} = req.body;

    // Updating login_status to false
    await models.customerModel.update({ login_status: false }, {
        where: {
          email: email
        }
    });

    return res.json({ data: "Logged out succesfully !!", error: null});
 
});



// Update a customer's phone no
router.put( '/phoneNo', utils.verifyToken, async(req, res) => {

    // Validation 
    let validated = await utils.vldt_c_phone_no.validate(req.body);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: "Invalid phone no!! Phone no must be of 10 digits"});
    }


    let customer = res.cur_customer;
    let ph_no = req.body.phone_no;
    ph_no = parseInt(ph_no);

    let [tmp, count] = await to(models.customerModel.update({ phone_no: ph_no }, {
        where: {
            id: customer.id
        }
    }));

    return res.json({ data: "Phone no updated successfully!!"});

});


// Update a customer's phone no
router.put( '/creditCard', utils.verifyToken, async(req, res) => {

    // Validation 
    let validated = await utils.vldt_c_credit_no.validate(req.body);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    }

    let customer = res.cur_customer;
    let cc_no = req.body.credit_card_no;
    cc_no = parseInt(cc_no);

    let [tmp, count] = await to(models.customerModel.update({ credit_card_no: cc_no }, {
        where: {
            id: customer.id
        }
    }));

    return res.json({ data: "Credit card no updated successfully!!"});

});


// Update a customer's phone no
router.put( '/address', utils.verifyToken, async(req, res) => {

    // Validation 
    let validated = await utils.vldt_c_address.validate(req.body);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    }


    let customer = res.cur_customer;
    let { addr1, addr2, city, region, postal_code, country} = req.body;
    postal_code = parseInt(postal_code);

    let [tmp, count] = await to(models.customerModel.update(
        { 
            addr1,
            addr2,
            city,
            region,
            postal_code,
            country

        }, 
        {
            where: {
                id: customer.id
            }
        }
    ));

    return res.json({ data: "Address updated successfully!!"});

});


router.get( '/try', utils.verifyToken, (req, res) => {
    return res.send("tryy");
})

module.exports = router;
