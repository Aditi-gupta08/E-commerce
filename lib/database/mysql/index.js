const Sequelize = require('sequelize');
const {to} = require('await-to-js');

const logger = require('../../logging/winston_logger');
const client = require('./client');

let customerModel = require('./../models/customerModel');

let categoryModel = require('./../models/categoryModel');

let productModel = require('./../models/productModel');

let reviewModel = require('./../models/reviewModel');

let cartModel = require('./../models/cartModel');

let orderModel = require('./../models/orderModel');

let ordersProductModel = require('./../models/ordersProductModel');



// --------------------------Associations--------------------------------

categoryModel.hasMany( productModel,{
    foreignKey: 'category_id'
});

productModel.belongsTo( categoryModel, {
    foreignKey: 'category_id'
});


productModel.hasMany( reviewModel, {
    foreignKey: 'product_id'
});

reviewModel.belongsTo( productModel, {
    foreignKey: 'product_id'
});


// Shopping cart

productModel.hasMany( cartModel, {
    foreignKey: 'product_id'
});

cartModel.belongsTo( productModel, {
    foreignKey: 'product_id'
});

customerModel.hasMany( cartModel, {
    foreignKey: 'customer_id'
});

cartModel.belongsTo( customerModel, {
    foreignKey: 'customer_id'
});


// Orders 
customerModel.hasMany( orderModel, {
    foreignKey: 'customer_id'
});

orderModel.belongsTo( customerModel, {
    foreignKey: 'customer_id'
});


// Orders Products
orderModel.hasMany( ordersProductModel, {
    foreignKey: 'order_id'
});

ordersProductModel.belongsTo( orderModel, {
    foreignKey: 'order_id'
});


const connectMysql = async() => {
    let [err, data] = await to( client.sync({ alter: false }));

    if(err)
        logger.error("Error in connecting to Database !");
    else
        logger.info('CONNECTED to Database');
};


module.exports = {
    connectMysql,
    customerModel,
    categoryModel,
    productModel,
    reviewModel,
    cartModel,
    orderModel,
    ordersProductModel
}