var express = require('express');
var jwt = require('jsonwebtoken');
var {to} = require('await-to-js');
const models = require('../lib/database/mysql/index');
const logger = require('../lib/logging/winston_logger');


async function total_amount( cust_id ) {
    let [err, PRODUCTS] = await to(models.cartModel.findAll(
        {   attributes: {exclude: ['createdAt', 'updatedAt', 'customer_id', 'id']},
            where: {
                customer_id: cust_id
            }
        }
    ));

    if(err)
        return res.json({data: null, error: err});

    let tot = 0;
    
    PRODUCTS.forEach( elem => {
        tot += elem.dataValues.subtotal;
    });

    return tot;
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





// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    total_amount,
   remove_product_from_cart,
   emptyCart

}