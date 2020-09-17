const express = require('express');
const router = express.Router();
const models = require('../lib/database/mysql/index');
const { to } = require('await-to-js');
const utils = require('../data/utils');
const Sequelize = require('sequelize');



// GET - See products in cart
router.get('/', utils.verifyToken, async(req, res) => {
    let cust = res.cur_customer;

    let [err, PRODUCTS] = await to(models.cartModel.findAll(
        {   attributes: {exclude: ['createdAt', 'updatedAt', 'customer_id', 'id']},
            where: {
                customer_id: cust.id
            }
        }
    ));

    console.log(PRODUCTS);

    if(err)
        return res.json({data: null, error: err});

    // Check if cart is empty or not
    if( PRODUCTS.length==0)
        return res.json({ data: null, error: "Cart is empty !!"});
    
    return res.send({ data: PRODUCTS, error: null});

});



// POST - ADD TO CART 
router.post('/add', utils.verifyToken, async(req, res) => {
    
    let cart_product = req.body;
    let cust = res.cur_customer;

    // Validation
    let validated = await utils.vldt_add_to_cart.validate(cart_product);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    }

    
    // Checking the product exist or not
    let [err, PRODUCT ] = await to(models.productModel.findOne(
        {   attributes: {exclude: ['createdAt', 'updatedAt']},
            where: {
                id: cart_product.product_id
            }
        }
    ));

    if(err)
        return res.json({data: null, error: err});

    if( PRODUCT == null)
        return res.json({ data: null, error: "No product exists with this id !"});


    // Checking if the user has already added th eproduct to cart or not- if yes, add the quantity to that entry
    let CART_ENTRY;
    [err, CART_ENTRY ] = await to(models.cartModel.findOne(
        {   attributes: {exclude: ['createdAt', 'updatedAt']},
            where: {
                customer_id: cust.id,
                product_id: cart_product.product_id
            }
        }
    ));

    if(err)
        return res.json({data: null, error: err});


    if( CART_ENTRY != null)
    {
        let new_qty = CART_ENTRY.quantity + cart_product.quantity;
            let new_subtotal = (new_qty)*(PRODUCT.discounted_price);
            
            let [tmp, count] = await to(models.cartModel.update(
                { 
                    quantity: new_qty,
                    subtotal: new_subtotal
                }, 
                {
                    where: {
                        id: CART_ENTRY.id
                    }
                }
            ));
    
        return res.json({ data: "Added to cart !!", error: null});
    }


    let n_product = {
        'customer_id': cust.id,
        'product_id': cart_product.product_id,
        'product_name': PRODUCT.dataValues.name,
        'quantity': cart_product.quantity,
        'unit_cost': PRODUCT.dataValues.discounted_price,
        'subtotal': (cart_product.quantity)*(PRODUCT.discounted_price)
    }

    const new_product = models.cartModel.build(n_product);
    await new_product.save();

    return res.json({ data: "Added to cart !", error: null}); 
});



// PUT - update an item in cart - update qty
router.put('/update/:product_id', utils.verifyToken, async(req, res) => {
 

    // Validation
    let validated = await utils.vldt_update_cart.validate( req.body );

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    }

       
    let prod_id = req.params.product_id;
    let qty = req.body.quantity;
    let cust = res.cur_customer;

    
    // Checking the product exist or not
    let [err, PRODUCT ] = await to(models.productModel.findOne(
        {   attributes: {exclude: ['createdAt', 'updatedAt']},
            where: {
                id: prod_id
            }
        }
    ));

    if(err)
        return res.json({data: null, error: err});

    if( PRODUCT == null)
        return res.json({ data: null, error: "No product exists with this id !"});


    // Checking if the user has already added the product to cart or not- if yes, add the quantity to that entry
    let CART_ENTRY;
    [err, CART_ENTRY ] = await to(models.cartModel.findOne(
        {   attributes: {exclude: ['createdAt', 'updatedAt']},
            where: {
                customer_id: cust.id,
                product_id: prod_id
            }
        }
    ));

    if(err)
        return res.json({data: null, error: err});


    if( CART_ENTRY != null)
    {
        let new_subtotal = (qty)*(PRODUCT.discounted_price);
            
        let [tmp, count] = await to(models.cartModel.update(
            { 
                quantity: qty,
                subtotal: new_subtotal
            }, 
                
            {
                where: {
                    id: CART_ENTRY.id
                }
            }
        ));
    
        return res.json({ data: " Updated product in cart !!", error: null});
    }

    return res.json({ data: null, error: "This product is not present in your cart !!"});


});



// DELETE - Remove all products from cart
router.delete('/empty', utils.verifyToken, async(req, res) => {
    
    let cust = res.cur_customer;

    let [err, deleted] = await to( models.cartModel.destroy({
        where: {
            customer_id: cust.id
        }
    }));

    if( deleted == 0 )
      return res.json({data: null, error: "Cart was already empty !!"});

    return res.json({ data: 'Cart is successfully emptied!!'});

});


// DELETE - Remove a product from cart
router.delete('/removeProduct/:product_id', utils.verifyToken, async(req, res) => {
    
    let cust = res.cur_customer;
    let prod_id = req.params.product_id;

    let [err, deleted] = await to( models.cartModel.destroy({
        where: {
            customer_id: cust.id,
            product_id: prod_id
        }
    }));

    if( deleted == 0 )
      return res.json({data: null, error: "This product wasn't in the cart !!"});

    return res.json({ data: 'Product is successfully removed from the cart !!'});

});


module.exports = router;