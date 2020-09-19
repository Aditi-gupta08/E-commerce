var express = require('express');
var jwt = require('jsonwebtoken');
var {to} = require('await-to-js');
const models = require('../lib/database/mysql/index');
const logger = require('../lib/logging/winston_logger');


async function get_prod_by_id( prod_id)
{
    let [err, PRODUCT ] = await to(models.productModel.findOne(
        {   attributes: {exclude: ['createdAt', 'updatedAt']},
            where: {
                id: prod_id
            }
        }
    ));

    return PRODUCT;
}




// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    get_prod_by_id
}