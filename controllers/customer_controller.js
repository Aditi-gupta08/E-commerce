const { to } = require('await-to-js');
const jwt = require('jsonwebtoken');

const models = require('../lib/database/mysql/index');
const joi_validtn = require('../data/joi');
const customer_services = require('../services/customers');


const get_cust_details = async (req, res, next) => {
    let [error, CUSTOMER] = await customer_services.get_cust_details(res.cur_customer.id);
    if(error)
        return res.json({ data: null, error});

    return res.json({ data: CUSTOMER, error: null});
}


const signup = async (req, res, next) => {
    
    let validated = await joi_validtn.vldt_signup.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });

    let created = await customer_services.signup(req.body);
    if(!created)
        return res.json({ data: null, error: "A customer with this email alreasy exists !"});
  
    return res.json({ data: "Customer signed up successfully !", error: null});

}


const update_cust_details = async (req, res, next) => {
    
    let validated = await joi_validtn.vldt_update_info.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });

    
    let customer = res.cur_customer;
    let cnt = await customer_services.update_cust(req.body, customer.id);
    
    return res.json({ data: "Info updated successfully!!"});
}


const login = async (req, res, next) => {
    
    let validated = await joi_validtn.vldt_login.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });


    let [error, newCustomer] = await customer_services.login(req.body);
    if(error)
        return res.json({ data: null, error});

    
    // Creating customer's token
    jwt.sign( { newCustomer }, process.env.secret_key, async (error, token) => {

        if(error)
            return res.json({ data: null, "error": "Error in assigning token" });

        await models.customerModel.update({ login_status: true }, {
            where: { email: newCustomer.email }
        });

        return res.json({ data: token, error: null})
 
    }); 
}


const logout = async (req, res, next) => {
    let cnt = await customer_services.logout( res.cur_customer.email);

    return res.json({ data: "Logged out succesfully !!", error: null});
 
}


const update_phone_no = async (req, res, next) => {
    
    let validated = await joi_validtn.vldt_c_phone_no.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: "Invalid phone no!! Phone no must be of 10 digits"});


    let cnt = await customer_services.update_phone_no( req.body.phone_no, res.cur_customer.id);
    return res.json({ data: "Phone no updated successfully!!"});
}


const update_credit_card_no = async (req, res, next) => {
    
    let validated = await joi_validtn.vldt_c_credit_no.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });


    let cc_no = req.body.credit_card_no;
    let cnt = await customer_services.update_credit_card_no(cc_no, res.cur_customer.id);
    return res.json({ data: "Credit card no updated successfully!!"});
}


const update_address = async (req, res, next) => {
    
    let validated = await joi_validtn.vldt_c_address.validate(req.body);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });


    let cnt = await customer_services.update_addr(req.body, res.cur_customer.id);

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