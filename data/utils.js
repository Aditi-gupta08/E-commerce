var express = require('express');
var jwt = require('jsonwebtoken');
var {to} = require('await-to-js');
var bcrypt = require('bcrypt');

const models = require('../lib/database/mysql/index');


// ----------------------------------------Useful functions---------------------------------------------------

// Verify token 
const verifyToken = (req, res, next) => {

    /* if( process.env.NODE_ENV == 'test')
    {
        console.log("test env");
        next();
    }
    else
    { */
        const bearerHeader = req.headers['authorization'];

        if(typeof bearerHeader !== 'undefined'){
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
      
            req.token = bearerToken;
    
            jwt.verify( req.token, process.env.secret_key, async (error, authData) => {
                if(error) {
                    return res.status(400).json({ "error": "Not verified successfully"}); 
                } 
                
                let email = authData.newCustomer.email;
                    
                // Checking if user exist and is logged in or not  
                let [err, CUSTOMER] = await to(models.customerModel.findOne({ 
                    where: {
                      email: email
                    }
                }));
                
                if(err)
                    return res.json({data: null, error: "Sone error occured in fetching data!"});
                
                if( CUSTOMER == null)
                    return res.json({ data: null, error: "No customer found with this id !"});
    
                if( CUSTOMER.dataValues.login_status == false)
                    return res.status(400).json({ "err": "Customer is not logged in !"});
    
                res.cur_customer = authData.newCustomer; 
                next();
                
            });
            
        } else {
          res.status(400).json({error: 'Token not found'});
        } 
    /* } */
    
}


const passwordHash = async (password) => {
    const saltRounds = 10;
    const [err, encrypted_pass ] = await to( bcrypt.hash(password, saltRounds));

    if(err)
        return res.send( {"msg": "Error while generating password hash"});     

    return encrypted_pass;
};



// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    verifyToken,
    passwordHash
}