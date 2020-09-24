var express = require('express');
var jwt = require('jsonwebtoken');
var {to} = require('await-to-js');
var bcrypt = require('bcrypt');
const joi = require('joi');
//const { JSONCookie } = require('cookie-parser');
const models = require('../lib/database/mysql/index');
const product_


const caching_all_prod = (req, res, next) => {

    let [err, value] = await to(cache.getValue("All_products"));
    if(err)
        res.json({ data: null, error: "Eror in getting value from Redis !!"});

    if( value !== null)
    {
        return res.json({ data: value, error: null});
    }

    if(value == null)
    {
        let [err, serv] = await to(product_services.get_all_prodiucts());

        if(err)
            return res.json({data: null, error: err});
        let [error, PRODUCTS] = serv;
        if(error)
            return res.json({data: null, error });

        let [err, data] = await to(cache.setValue("All_products", PRODUCTS));
        if(err)
            res.json({ data: null, error: "Eror in setting value in Redis !!"});

    }

    res.json({ data: value, error: null});

}


// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    caching_all_prod
}