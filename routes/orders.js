const express = require('express');
const router = express.Router();
const { to } = require('await-to-js');
const Sequelize = require('sequelize');


const models = require('../lib/database/mysql/index');
const utils = require('../data/utils');
const logger = require('../lib/logging/winston_logger');
const cart_services = require('../services/shopping_cart');
const product_services = require('../services/products');


// Buy from cart
router.post('/from_Cart', utils.verifyToken, async(req, res) => {
    let cust = res.cur_customer;

    let [err, CUSTOMER] = await to(models.customerModel.findOne({
        where: { id: cust.id}
    }));

    if(CUSTOMER.dataValues.addr1 == null)
        return res.json({ data: null, error: "Please update your addresss details before placing the order !!"});

    if(CUSTOMER.dataValues.phone_no == null)
        return res.json({ data: null, error: "Please update your phone no before placing the order !!"});

    if(CUSTOMER.dataValues.credit_card_no == null)
        return res.json({ data: null, error: "Please update your credit card number before placing the order !!"});



    // Extracting products from 
    let CART;
    [err, CART] = await to(models.cartModel.findAll(
        {   attributes: {exclude: ['createdAt', 'updatedAt', 'customer_id', 'id']},
            where: {
                customer_id: cust.id
            }
        }
    ));

    if(err)
        return res.json({data: null, error: err});

    if(CART.length == 0)
        return res.json({ data: "No product in cart !!"});

    let tot_amt = 0;
    
    CART.forEach( elem => {
        tot_amt += elem.dataValues.subtotal;
    });

    if(err)
        return res.json({data: null, error: err});



    // Adding to orders table
    let order_info = {
        'customer_id': cust.id,
        'subtotal': tot_amt,
        'paymentDone': true
    }

    let newOrder;
    [err, newOrder] = await to(models.orderModel.create( order_info ));

    if(err)
        return res.json({data: null, error: err});


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
            customer_id: cust.id
        }
    }));

    return res.json({ data: `Order done !! Your order id: ${order_id}`, error: null});

});



// POST order
router.post('/from_products', utils.verifyToken, async(req, res) => {
    
    let ordr = req.body;
    let cust = res.cur_customer;
    let prod_id = ordr.product_id;

    let [err, CUSTOMER] = await to(models.customerModel.findOne({
        where: { id: cust.id}
    }));

    if(CUSTOMER.dataValues.addr1 == null)
        return res.json({ data: null, error: "Please update your addresss details before placing the order !!"});

    if(CUSTOMER.dataValues.phone_no == null)
        return res.json({ data: null, error: "Please update your phone no before placing the order !!"});

    if(CUSTOMER.dataValues.credit_card_no == null)
        return res.json({ data: null, error: "Please update your credit card no before placing the order !!"});



    // Validation
    let validated = await utils.vldt_add_order_from_prod.validate(ordr);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    } 

    let PRODUCT;
    [err, PRODUCT] = await to(product_services.get_prod_by_id(prod_id) );

    if(err)
        return res.json({data: null, error: err});

    if( PRODUCT == null)
        return res.json({ data: null, error: "No product found with this id !"});

    /* let today = new Date();

    today.setDate(today.getDate() + 2);
    logger.info(today.toLocaleDateString()); */
    
    let order_info = {
        'customer_id': cust.id,
        'subtotal': (ordr.quantity)*(PRODUCT.discounted_price),
        'paymentDone': true
    }

    // create order 
    let newOrder;
    [err, newOrder] = await to(models.orderModel.create( order_info ));

    if(err)
        return res.json({data: null, error: err});

    let order_id = newOrder.dataValues.id;

    let order_products = {
        order_id,
        'product_id': ordr.product_id,
        'product_name': PRODUCT.name,
        'quantity': ordr.quantity,
        'unit_cost': PRODUCT.discounted_price,
        'subtotal': (ordr.quantity)*(PRODUCT.discounted_price)
    } 

    let newOrder_products;
    [err, newOrder_products] = await to(models.ordersProductModel.create( order_products));

    if(err)
        return res.json({data: null, error: err});

    return res.json({ data: `Order done !! Your order id: ${order_id}`, error: null});
    
});



// Get orders of current customer
router.get('/inCustomer', utils.verifyToken, async(req, res) => {

    let cust = res.cur_customer;

    let [err, ORDERS] = await to(models.orderModel.findAll(
        {   attributes: {exclude: ['createdAt', 'updatedAt', 'customer_id']},
            where: {
            customer_id: cust.id
            },
            include: [{   model: models.ordersProductModel,
                attributes: {exclude: ['createdAt', 'updatedAt', 'order_id', 'id']}
            }]
        }
    ));
    

    if(err)
        return res.json({data: null, error: err});

    if( ORDERS == [])
        return res.json({ data: null, error: "The customer dont has any order!"});
    
    return res.send({ data: ORDERS, error: null});

});



// Get order by id
router.get('/:order_id', async(req, res) => {
    let order_id = req.params.order_id;

    let [err, ORDER] = await to(models.orderModel.findOne(
        {   
            where: { id: order_id},
            attributes: {exclude: ['updatedAt',]},
            include: [{   model: models.ordersProductModel,
                attributes: {exclude: ['createdAt', 'updatedAt', 'order_id', 'id']}
            }]
        }
    ));


    if(err)
        return res.json({data: null, error: err});


    if( ORDER == null)
        return res.json({ data: null, error: "No order found with this id !"});
    
    return res.send({ data: ORDER, error: null});

});



module.exports = router;