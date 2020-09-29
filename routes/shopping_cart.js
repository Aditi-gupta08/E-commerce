const express = require('express');
const Sequelize = require('sequelize');
const { to } = require('await-to-js');
const router = express.Router();


const models = require('../lib/database/mysql/index');
const utils = require('../data/utils');
const cart_services = require('../services/shopping_cart');
const product_services = require('../services/products');
const logger = require('../lib/logging/winston_logger');
const joi_validtn = require('../data/joi');



// GET - See products in cart
router.get('/', utils.verifyToken, async(req, res) => {
    let cust = res.cur_customer;

    let [error, serv] = await to(cart_services.get_prod_from_cart( cust.id ));

    if(error)
        console.log(error);

    if(error)
        res.json({ data: null, error: error});

    if(serv[0])
        res.json({ data: null, error: serv[0]});
    
    return res.send({ data: serv[1], error: null});

});



// GET - Total amount of products in cart
router.get('/totalAmount', utils.verifyToken, async(req, res) => {
    let cust = res.cur_customer;
    let [err, serv] = await to(cart_services.total_amount( cust.id ));

    if(err)
        return res.json({data: null, error: err});

    if(serv[0])
        return res.json({ data: null, error: serv[0] });
    
    return res.send({ data: `Total amount: ${serv[1]}`, error: null});
});



// POST - ADD TO CART 
router.post('/add', utils.verifyToken, async(req, res) => {
    
    let cart_product = req.body;
    let cust = res.cur_customer;

    // Validation
    let validated = await joi_validtn.vldt_add_to_cart.validate(cart_product);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });


    let [err, serv] = await to(cart_services.add_to_cart(cart_product, cust));
    if(err)
        return res.json({data: null, error: err});

    if(serv[0])
        return res.json({ data: null, error: serv[0] });

    return res.json({ data: "Added to cart !", error: null}); 
});



// PUT - update an item in cart - update qty
router.put('/update/:product_id', utils.verifyToken, async(req, res) => {
 

    // Validation
    let validated = await joi_validtn.vldt_update_cart.validate( req.body );

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });

       
    let prod_id = req.params.product_id;
    let qty = req.body.quantity;


    let [err, serv] = await to(cart_services.update_prod_in_cart( prod_id, qty, res.cur_customer));
    if(err)
        return res.json({data: null, error: err});

    if(serv[0])
        return res.json({ data: null, error: serv[0] });

    
    return res.json({ data: " Updated product in cart !!", error: null});

});



// DELETE - Remove all products from cart
router.delete('/empty', utils.verifyToken, async(req, res) => {
    
    let cust = res.cur_customer;

    let [err, isDeleted] = await to(cart_services.emptyCart(cust.id));

    if(err)
        return res.json({data: null, error: err});

    if( !isDeleted )
      return res.json({data: null, error: "Cart was already empty !!"});

    return res.json({ data: 'Cart is successfully emptied!!'});

});


// DELETE - Remove a product from cart
router.delete('/removeProduct/:product_id', utils.verifyToken, async(req, res) => {
    
    let cust = res.cur_customer;
    let prod_id = req.params.product_id;

    let [err, isDeleted] = await to(cart_services.remove_product_from_cart(cust.id, prod_id));

    if(err)
        return res.json({data: null, error: err});

    if( !isDeleted )
      return res.json({data: null, error: "This product wasn't in the cart !!"});

    return res.json({ data: 'Product is successfully removed from the cart !!'});

});


module.exports = router;