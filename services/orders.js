var express = require('express');
var jwt = require('jsonwebtoken');
var {to} = require('await-to-js');

const models = require('../lib/database/mysql/index');
const logger = require('../lib/logging/winston_logger');
const cart_services = require('./shopping_cart');
const product_services = require('./products');


async function get_order_by_order_id( order_id)
{
    let [err, ORDER] = await to(models.orderModel.findOne(
        {   
            where: { id: order_id},
            attributes: {exclude: ['updatedAt', 'createdAt']},
            include: [{   model: models.ordersProductModel,
                attributes: {exclude: ['createdAt', 'updatedAt', 'order_id', 'id']}
            }]
        }
    ));
    
    let error;

    if(err)
        error = err;
    else if(ORDER == null)
        error = "No order found with this id !";

    return [error, ORDER];
}


async function get_order_by_cust_id( cust_id )
{
    let [err, ORDERS] = await to(models.orderModel.findAll(
        {   attributes: {exclude: ['createdAt', 'updatedAt', 'customer_id']},
            where: {
            customer_id: cust_id
            },
            include: [{   model: models.ordersProductModel,
                attributes: {exclude: ['createdAt', 'updatedAt', 'order_id', 'id']}
            }]
        }
    ));

    return ORDERS;
}


async function req_to_put_order(cust_id) {

    let [err, CUSTOMER] = await to(models.customerModel.findOne({
        where: { id: cust_id}
    }));

    let error;

    if(err)
        error = err; 

    if(CUSTOMER.dataValues.addr1 == null)
        error = "Please update your addresss details before placing the order !!";

    if(CUSTOMER.dataValues.phone_no == null)
        error ="Please update your phone no before placing the order !!";

    if(CUSTOMER.dataValues.credit_card_no == null)
        error = "Please update your credit card number before placing the order !!";   

    return [error, CUSTOMER];
}


async function create_order(cust_id, tot_amt) {

    let today = new Date();
    let del = new Date();

    del.setDate(del.getDate() + 2);
    let orderDate = today.toLocaleDateString();
    let deliveryDate = del.toLocaleDateString();


    // Adding to orders table
    let order_info = {
        'customer_id': cust_id,
        'subtotal': tot_amt,
        'paymentDone': true,
        orderDate,
        deliveryDate
    }

    let [err, newOrder] = await to(models.orderModel.create( order_info ));

    return [err, newOrder];

}


async function post_order_buy_from_products(cust_id, ordr, prod_id) {

    let [err, serv] = await to(product_services.get_prod_by_id(prod_id) );

    if(err)
        return [err, null];

    let [error, PRODUCT] = serv;
    if(error)
        return [error, null];


    [err, serv] = await to( create_order( cust_id, (ordr.quantity)*(PRODUCT.discounted_price)) );

    let newOrder;
    [error, newOrder] = serv;

    if(error)
        return [error, null];

    let order_id = newOrder.dataValues.id;

    let order_products = {
        order_id,
        'product_id': ordr.product_id,
        'product_name': PRODUCT.name,
        'quantity': ordr.quantity,
        'unit_cost': PRODUCT.discounted_price,
        'subtotal': (ordr.quantity)*(PRODUCT.discounted_price)
    } 

    let newOrder_products
    [err, newOrder_products] = await to(models.ordersProductModel.create( order_products));

    return [err, order_id];
}


async function post_order_buy_from_cart(cust_id) 
{

    let [err, serv] = await to( cart_services.get_prod_from_cart( cust_id ));
    let [error, CART] = serv;

    if(err)
        return [err, null];

    if(error)
        return [error, null];


    [err, serv] = await to(cart_services.total_amount( cust_id ));
    [error, tot_amt] = serv;

    if(err)
        return [err, null];

    if(error)
        return [error, null];   


    [err, serv] = await to( create_order( cust_id, tot_amt ) );
    let newOrder;
    [error, newOrder] = serv;
    if(error)
        return [error, null];


    // Adding to order-prodcuts table
    let order_id = newOrder.dataValues.id;
    let order_products_data = [];


    CART.forEach( (prod) => {
        tmp = prod.dataValues;
        tmp["order_id"] = order_id;
        order_products_data.push(tmp);
    });


    let order_products;
    [err, order_products] = await to(models.ordersProductModel.bulkCreate( order_products_data ));


    if(err)
        return res.json({data: null, error: err});

    let deleted;
    [err, deleted] = await to( models.cartModel.destroy({
        where: {
            customer_id: cust_id
        }
    }));

    return [err, order_id];
}

// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    get_order_by_order_id,
    get_order_by_cust_id,
    req_to_put_order,
    create_order,
    post_order_buy_from_products,
    post_order_buy_from_cart
}