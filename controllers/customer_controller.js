const { to } = require('await-to-js');
const jwt = require('jsonwebtoken');

const models = require('../lib/database/mysql/index');
const joi_validtn = require('../data/joi');
const customer_services = require('../services/customers');


const get_cust_details = async (req, res, next) => {
    let [err, serv] = await to(customer_services.get_cust_details(res.cur_customer.id));
    if(err)
        return res.json({ data: null, error: err});
    
    let [error, CUSTOMERS] = serv;
    if(error)
        return res.json({ data: null, error});

    return res.send({ data: CUSTOMERS, error: null});
}


const signup = async (req, res, next) => {
    
    let validated = await joi_validtn.vldt_signup.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });

  
    let [err, created] = await to(customer_services.signup(req.body));
    if(err)
        return res.json({ data: null, error: err});

    if(!created)
        return res.json({ data: null, error: "A customer with this email alreasy exists !"});
  
    return res.json({ data: "Customer signed up successfully !", error: null});

}


const update_cust_details = async (req, res, next) => {
    
    let validated = await joi_validtn.vldt_update_info.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });

    
    let customer = res.cur_customer;
    let [err, cnt] = await to(customer_services.update_cust(req.body, customer.id));
    if(err)
        return res.json({ data: null, error: err});
    
    return res.json({ data: "Info updated successfully!!"});
}


const login = async (req, res, next) => {
    
    let validated = await joi_validtn.vldt_login.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });


    let [err, serv] = await to(customer_services.login(req.body));
    if(err)
        return res.json({ data: null, error: err});

    let [error, newCustomer] = serv;
    if(error)
        return res.json({ data: null, error});

    
    // Creating customer's token
    jwt.sign( { newCustomer }, process.env.secret_key, async (error, token) => {

        if(error)
            return res.json({ data: null, "error": "Error in assigning token" });

        await models.customerModel.update({ login_status: true }, {
            where: { email: newCustomer.email }
        });

        return res.json({ access_token: token, error: null})
 
    }); 
}


const logout = async (req, res, next) => {
    let [err, cnt] = await to(customer_services.logout( res.cur_customer.email));
    if(err)
        return res.json({ data: null, error: err});

    return res.json({ data: "Logged out succesfully !!", error: null});
 
}


const update_phone_no = async (req, res, next) => {
    
    let validated = await joi_validtn.vldt_c_phone_no.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: "Invalid phone no!! Phone no must be of 10 digits"});


    let [err, cnt] = await to(customer_services.update_phone_no( req.body.phone_no, res.cur_customer.id));
    if(err)
        return res.json({ data: null, error: err});
    
    return res.json({ data: "Phone no updated successfully!!"});
}


const update_credit_card_no = async (req, res, next) => {
    
    let validated = await joi_validtn.vldt_c_credit_no.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });


    let cc_no = req.body.credit_card_no;
    let [err, cnt] = await to(customer_services.update_credit_card_no(cc_no, res.cur_customer.id));
    if(err)
        return res.json({ data: null, error: err});

    return res.json({ data: "Credit card no updated successfully!!"});
}


const update_address = async (req, res, next) => {
    
    let validated = await joi_validtn.vldt_c_address.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });


    let [err, cnt] = await to(customer_services.update_addr(req.body, res.cur_customer.id));
    if(err)
        return res.json({ data: null, error: err});

    return res.json({ data: "Address updated successfully!!", error: null});

}


// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    get_cust_details,
    signup,
    update_cust_details,
    login,
    logout,
    update_phone_no,
    update_credit_card_no,
    update_address
}