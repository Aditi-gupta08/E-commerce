var express = require('express');
var jwt = require('jsonwebtoken');
var {to} = require('await-to-js');
const models = require('../lib/database/mysql/index');
const logger = require('../lib/logging/winston_logger');


async function get_all_prodiucts()
{
    let [err, PRODUCTS] = await to(models.productModel.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']}
      }));

    let error;
    if(err)
        error = err;
    else if( PRODUCTS == [])
        error = "No product avaliable!";

    return [error, PRODUCTS];

}


async function get_prod_by_id( prod_id)
{
    let [err, PRODUCT ] = await to(models.productModel.findOne(
        {   attributes: {exclude: ['createdAt', 'updatedAt']},
            where: {
                id: prod_id
            }
        }
    ));

    let error;

    if(err)
        error = err;
    else if( PRODUCT == null)
        error = "No product found with this id !";

    return [error, PRODUCT];
}




// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    get_prod_by_id,
    get_all_prodiucts
}