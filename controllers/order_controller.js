const { to } = require('await-to-js');

const order_services = require('../services/orders');
const joi_validtn = require('../data/joi');


const buy_from_cart = async (req, res, next) => {
    let cust = res.cur_customer;
    let cust_id = cust.id;
    
    let [err, serv] = await to( order_services.req_to_put_order( cust_id) );

    if(err)
        res.json({ data: null, error: err});

    if(serv[0])
        res.json({ data: null, error: serv[0]});


    [err, serv] = await to( order_services.post_order_buy_from_cart(cust_id) );

    if(err)
        res.json({ data: null, error: err });

    if(serv[0])
        res.json({ data: null, error: serv[0]});

    return res.json({ data: `Order done !! Your order id: ${serv[1]}`, error: null});

}


const buy_from_prod = async (req, res, next) => {
    let ordr = req.body;
    let prod_id = ordr.product_id;
    let cust = res.cur_customer;
    let cust_id = cust.id;
    

    let [err, serv] = await to( order_services.req_to_put_order( cust_id) );

    if( err )
        res.json({ data: null, error: err });

    if( serv[0])
        res.json({ data: null, error: serv[0]});


    // Validation
    let validated = await joi_validtn.vldt_add_order_from_prod.validate(ordr);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    } 



    [err, serv] = await to( order_services.post_order_buy_from_products(cust_id, ordr, prod_id) );

    if(err)
        res.json({ data: null, error: err});

    if(serv[0])
        res.json({ data: null, error: serv[1]});

    return res.json({ data: `Order done !! Your order id: ${serv[1]}`, error: null}); 
}



const get_all_orders_of_cust = async (req, res, next) => {
    let cust_id = res.cur_customer.id;
    
    let [err, ORDERS] = await to( order_services.get_order_by_cust_id( cust_id) );

    if(err)
        return res.json({data: null, error: err});

    if( ORDERS == [])
        return res.json({ data: null, error: "The customer dont has any order!"});
    
    return res.send({ data: ORDERS, error: null});
}


const get_order_by_id = async (req, res, next) => {
    let order_id = req.params.order_id;

    let [err, serv] = await to( order_services.get_order_by_order_id(order_id) );

    if(err)
        return res.json({data: null, error: err});
    
    return res.json({ data: serv[1], error: serv[0]});
}



// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    buy_from_cart,
    buy_from_prod,
    get_all_orders_of_cust,
    get_order_by_id
}