var express = require('express');
var jwt = require('jsonwebtoken');
var {to} = require('await-to-js');
var bcrypt = require('bcrypt');
const joi = require('joi');


const models = require('../../lib/database/mysql/index');
const cache = require('../../lib/cache/redis');


const caching_all_prod = async (req, res, next) => {

    let [err, value] = await to(cache.getValue("All_Products"));
    if(err)
        res.json({ data: null, error: "Eror in getting value from Redis !!"});

    if( value !== null)
    {
        value = JSON.parse(value);
        return res.json({ data: value, error: null});
    }

    next();
}

const caching_all_catg = async (req, res, next) => {

    let [err, value] = await to(cache.getValue("All_Categories"));
    if(err)
        res.json({ data: null, error: "Eror in getting value from Redis !!"});

    if( value !== null)
    {
        value = JSON.parse(value);
        return res.json({ data: value, error: null});
    }

    next();
}


// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    caching_all_prod,
    caching_all_catg
}