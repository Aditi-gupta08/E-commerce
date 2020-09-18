var express = require('express');
var jwt = require('jsonwebtoken');
var {to} = require('await-to-js');
const models = require('../lib/database/mysql/index');



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



// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    total_amount
}