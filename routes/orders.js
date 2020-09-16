const express = require('express');
const router = express.Router();
const models = require('../lib/database/mysql/index');
const { to } = require('await-to-js');
const utils = require('../data/utils');
const Sequelize = require('sequelize');


// POST order
router.post('/', utils.verifyToken, async(req, res) => {
    
    let ordr = req.body;
    let cust = res.cur_customer;

    // Validation
    let validated = await utils.vldt_add_order.validate(ordr);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    }

    let [err, PRODUCT] = await to(models.productModel.findOne(
        {   attributes: {exclude: ['createdAt', 'updatedAt']},
            where: {
            id: ordr.product_id
            }
        }
    ));

    if(err)
        return res.json({data: null, error: err});

    if( PRODUCT == null)
        return res.json({ data: null, error: "No product found with this id !"});

    let order = {
        'customer_id': cust.id,
        'product_id': ordr.product_id,
        'product_name': PRODUCT.name,
        'quantity': ordr.quantity,
        'unit_cost': PRODUCT.discounted_price,
        'subtotal': (ordr.quantity)*(PRODUCT.discounted_price)
    }
    

    // find course or create new one
    const newOrder = models.orderModel.build( order );

    await newOrder.save();

    return res.json({ data: "Order done successfully !", error: null});
});


// Get orders of current customer
router.get('/inCustomer', utils.verifyToken, async(req, res) => {

    let cust = res.cur_customer;

    let [err, ORDERS] = await to(models.orderModel.findAll(
        {   attributes: {exclude: ['createdAt', 'updatedAt', 'customer_id']},
            where: {
            customer_id: cust.id
            }
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
    let ordr_id = req.params.order_id;

    let [err, ORDER] = await to(models.orderModel.findOne(
        {   attributes: {exclude: ['createdAt', 'updatedAt']},
            where: {
            id: ordr_id
            }
        }
    ));




    if(err)
        return res.json({data: null, error: err});

    if( ORDER == null)
        return res.json({ data: null, error: "No order found with this id !"});
    
    return res.send({ data: ORDER, error: null});

});



module.exports = router;