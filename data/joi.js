var express = require('express');
const joi = require('joi');

const models = require('../lib/database/mysql/index');

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


module.exports = {
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