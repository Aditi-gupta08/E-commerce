const { to } = require('await-to-js');

const cart_services = require('../services/shopping_cart');
const joi_validtn = require('../data/joi');


const get_prod_in_cart = async (req, res, next) => {

    let cust = res.cur_customer;

    let [error, PRODUCTS] = await cart_services.get_prod_from_cart( cust.id );

    if(error)
        res.json({ data: null, error: error});
    
    return res.json({ data: PRODUCTS, error: null});
}


const total_amt_of_cart = async (req, res, next) => {

    let cust = res.cur_customer;
    let [err, AMT] = await cart_services.total_amount( cust.id );

    if(err)
        return res.json({data: null, error: err});
    
    return res.send({ data: `Total amount: ${AMT}`, error: null});
}


const add_to_cart = async (req, res, next) => {

    let cart_product = req.body;
    let cust = res.cur_customer;

    // Validation
    let validated = await joi_validtn.vldt_add_to_cart.validate(cart_product);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });


    let [err, serv] = await cart_services.add_to_cart(cart_product, cust);
    if(err)
        return res.json({data: null, error: err});

    return res.json({ data: "Added to cart !", error: null}); 

}


const update_prod_qty_in_cart = async (req, res, next) => {

    let validated = await joi_validtn.vldt_update_cart.validate( req.body );

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });

       
    let prod_id = req.params.product_id;
    let qty = req.body.quantity;


    let [err, serv] = await cart_services.update_prod_in_cart( prod_id, qty, res.cur_customer);
    if(err)
        return res.json({data: null, error: err});

    return res.json({ data: " Updated product in cart !!", error: null});
}


const empty_cart = async (req, res, next) => {
    
    let cust = res.cur_customer;

    let [err, isDeleted] = await cart_services.emptyCart(cust.id);
    if(err)
        return res.json({data: null, error: err});

    if( !isDeleted )
      return res.json({data: null, error: "Cart was already empty !!"});

    return res.json({ data: 'Cart is successfully emptied!!'});
}


const remove_a_prod_from_cart = async (req, res, next) => {

    let cust = res.cur_customer;
    let prod_id = req.params.product_id;

    let [err, isDeleted] = await cart_services.remove_product_from_cart(cust.id, prod_id);

    if(err)
        return res.json({data: null, error: err});

    if( !isDeleted )
      return res.json({data: null, error: "This product wasn't in the cart !!"});

    return res.json({ data: 'Product is successfully removed from the cart !!'});

}


// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    get_prod_in_cart,
    total_amt_of_cart,
    add_to_cart,
    update_prod_qty_in_cart,
    empty_cart,
    remove_a_prod_from_cart
}