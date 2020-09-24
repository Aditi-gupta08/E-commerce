var express = require('express');
var jwt = require('jsonwebtoken');
var {to} = require('await-to-js');
var bcrypt = require('bcrypt');
const joi = require('joi');
//const { JSONCookie } = require('cookie-parser');
const models = require('../lib/database/mysql/index');


// ----------------------------------------Useful functions---------------------------------------------------

// Verify token (Middleware function)
const verifyToken = (req, res, next) => {

    // Get auth header value
    const bearerHeader = req.headers['authorization'];
  
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
  
        req.token = bearerToken;

        jwt.verify( req.token, 'secretkey', async (error, authData) => {
            if(error) {
                return res.status(400).json({ "error": "Not verified successfully"}); 
            } 
            
            //console.log(authData);
            let email = authData.newCustomer.email;
                
            // Checking if user exist and is logged in or not  
            let [err, CUSTOMER] = await to(models.customerModel.findOne({ 
                where: {
                  email: email
                }
            }));
            
            if(err)
                return res.json({data: null, error: "Sone error occured in fetching data!"});
            
            if( CUSTOMER == null)
                return res.json({ data: null, error: "No customer found with this id !"});

            if( CUSTOMER.dataValues.login_status == false)
                return res.status(400).json({ "err": "Customer is not logged in !"});

            //console.log(authData.newStudent);
            res.cur_customer = authData.newCustomer; 
            next();
            
        });
        
    } else {
      res.status(400).json({error: 'Token not found'});
    } 
}

const passwordHash = async (password) => {
    const saltRounds = 10;
    const [err, encrypted_pass ] = await to( bcrypt.hash(password, saltRounds));

    if(err)
        //console.log(err);
        return res.send( {"msg": "Error while generating password hash"});      // res should be removed!

    return encrypted_pass;
};



// ---------------------------------------------------Joi validations---------------------------------------------------------
const vldt_signup = joi.object().keys({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).max(10).required()
});


const vldt_login = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(3).max(10).required()
});


const vldt_c_phone_no = joi.object().keys({
    phone_no: joi.number().integer().min(1000000000).max(9999999999).required() 
});


const vldt_c_credit_no = joi.object().keys({
    credit_card_no: joi.number().positive().required()
});


const vldt_c_address = joi.object().keys({
    addr1: joi.string().required(),
    addr2: joi.string(),
    city: joi.string().required(),
    region: joi.string(),
    postal_code: joi.number().positive().required(),
    country: joi.string().required()
});


const vldt_update_info = joi.object().keys({
    name: joi.string(),
    phone_no: joi.number().integer().min(1000000000).max(9999999999),
    credit_card_no: joi.number().positive(),
    addr1: joi.string(),
    addr2: joi.string(),
    city: joi.string(),
    region: joi.string(),
    postal_code: joi.number().positive(),
    country: joi.string()
});


//Categories validation
const vldt_add_category = joi.object().keys({
    name: joi.string().required(),
    desc:  joi.string()
});


// Products validation
const vldt_add_products = joi.object().keys({
    name: joi.string().required(),
    desc: joi.string(),
    price: joi.number().positive().required(),
    discounted_price: joi.number().positive().required()
});

const vldt_add_review = joi.object().keys({
    rating: joi.number().integer().min(1).max(5).required() ,
    review: joi.string().required()
});

// Shoppping cart
const vldt_add_to_cart = joi.object().keys({
    product_id: joi.number().required(),
    quantity: joi.number().required()
});


// Order validation
const vldt_add_order_from_prod = joi.object().keys({
    product_id: joi.number().required(),
    quantity: joi.number().required()
});

const vldt_update_cart = joi.object().keys({
    quantity: joi.number().required()
});


const admin_id = 1;

// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    admin_id,
    verifyToken,
    passwordHash,
    vldt_signup,
    vldt_login,
    vldt_c_phone_no,
    vldt_c_credit_no,
    vldt_c_address,
    vldt_update_info,
    vldt_add_category,
    vldt_add_products,
    vldt_add_review,
    vldt_add_to_cart,
    vldt_add_order_from_prod,
    vldt_update_cart
}