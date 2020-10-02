var {to} = require('await-to-js');

const models = require('../lib/database/mysql/index');
const product_services = require('./products');


//------------------------------------------------------- FUNCTIONS ----------------------------------------------------------
async function get_prod_from_cart( cust_id ) {

    let [err, PRODUCTS] = await to(models.cartModel.findAll(
        {   attributes: {exclude: ['createdAt', 'updatedAt', 'customer_id', 'id']},
            where: {
                customer_id: cust_id
            }
        }
    ));
    
    let error;
    if(err)
        error = err;
    else if(PRODUCTS.length == 0)
        //throw new Error("emptyy !!");
        error = "Cart is empty !!";

    return [error, PRODUCTS];
}


async function total_amount( cust_id ) {
    let [err, serv] = await to(get_prod_from_cart( cust_id ));

    if(err)
        return [err, null];

    let [error, PRODUCTS] = serv;
    if(error)
        return [error, null];
    

    let tot = 0;
    PRODUCTS.forEach( elem => {
        tot += elem.dataValues.subtotal;
    });

    return [null, tot];
}



async function remove_product_from_cart( cust_id, prod_id) {
    let [err, deleted] = await to( models.cartModel.destroy({
        where: {
            customer_id: cust_id,
            product_id: prod_id
        }
    }));

    return deleted;
}


async function emptyCart( cust_id ) {
    let [err, deleted] = await to( models.cartModel.destroy({
        where: {
            customer_id: cust_id
        }
    }));

    return deleted;
}


async function add_to_cart( cart_product, cust)
{
        // Checking the product exist or not
        let [err, serv] = await to(product_services.get_prod_by_id(cart_product.product_id) );

        if(err)
            return [err, null];
    
        let [error, PRODUCT] = serv;
    
        if(error)
            return [error, null];
    
    
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
            return [err, null];
    
    
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
        
            return [null, true];
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
        let tmp;
        [err, tmp] = await to(new_product.save());

        console.log(err);

        if(err)
            return [err, null];

        return [null, tmp];
}



async function update_prod_in_cart( prod_id, qty, cust)
{
        // Checking the product exist or not
        let [err, serv] = await to(product_services.get_prod_by_id(prod_id) );

        if(err)
            return [err, null];

        let [error, PRODUCT] = serv;

        if(error)
            return [error, null];

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
            return [err, null]


        if( CART_ENTRY === null)
        {
            return ["This product is not present in your cart !!"];
        }


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

        return [null, count];
}



// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    get_prod_from_cart,
    total_amount,
   remove_product_from_cart,
   emptyCart,
   add_to_cart,
   update_prod_in_cart

}