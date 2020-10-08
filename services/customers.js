var {to} = require('await-to-js');
const bcrypt = require('bcrypt');

const models = require('../lib/database/mysql/index');
const logger = require('../lib/logging/winston_logger');
const utils = require('../data/utils');


async function get_cust_details(cust_id)
{
    let [err, CUSTOMER] = await to(models.customerModel.findOne({
        where: { id: cust_id}
    }));

    return [err, CUSTOMER];
}


async function signup(customer_payload)
{
    const [tmp, encrypted_pass] = await to( utils.passwordHash( customer_payload.password));
    console.log(tmp);
    if(tmp)
        return res.json({ data: null, error: "Error in encrypting password", tmp});

    const [ customer, created] = await models.customerModel.findOrCreate({
        where: { email: customer_payload.email },
        defaults: {
            name: customer_payload.name,
            email: customer_payload.email,
            encrypted_pass: encrypted_pass,
            login_status: false
        }
    });

    return created;
}



async function login(payload_customer)
{
    // Checking if customer isn't signed up or already logged in
    let [err, CUSTOMER ] = await to(models.customerModel.findOne({ 
        where: {
          email: payload_customer.email
        }
    }));
    
    if(err)
        return ["Some error occured in fetching data!"];
    
    if( CUSTOMER == null )
        return ["No customer found with this email!"];

    let customer = CUSTOMER.dataValues;


    if( customer.login_status == true)
        return ["User is already logged in!", null];

    
    const newCustomer = {
        id: customer.id,
        name: customer.name,
        email: customer.email
    } 
    
    // Checking password
    let [error, isValid] = await to( bcrypt.compare( payload_customer.password, customer.encrypted_pass) )

    if(error){
        return ["Some error occured in comparing password", null];
    }

    if(!isValid){
        return ["Incorrect Password !", null];
    }

    return [null, newCustomer];
}




async function logout(email)
{
    let [tmp, count] = await to(models.customerModel.update({ login_status: false }, {
        where: {
        email: email
        }
    }));

    return count;
}



async function update_cust(cust_payload, cust_id)
{
    let { name, phone_no, credit_card_no, addr1, addr2, city, region, postal_code, country} = cust_payload;

    let [tmp, count] = await to(models.customerModel.update(
        { 
            name,
            phone_no, 
            credit_card_no,
            addr1,
            addr2,
            city,
            region,
            postal_code,
            country
        }, 
        {
            where: {
                id: cust_id
            }
        }
    ));

    return count;
}


async function update_addr(addr_payload, cust_id)
{
    let { addr1, addr2, city, region, postal_code, country} = addr_payload;
    postal_code = parseInt(postal_code);

    let [tmp, count] = await to(models.customerModel.update(
        { 
            addr1,
            addr2,
            city,
            region,
            postal_code,
            country
        }, 
        {
            where: {
                id: cust_id
            }
        }
    ));

    return count;
}


async function update_credit_card_no(cc_no, cust_id)
{
    cc_no = parseInt(cc_no);

    let [tmp, count] = await to(models.customerModel.update({ credit_card_no: cc_no }, {
        where: {
            id: cust_id
        }
    }));

    return count;
}


async function update_phone_no(ph_no, cust_id)
{
    ph_no = parseInt(ph_no);

    let [tmp, count] = await to(models.customerModel.update({ phone_no: ph_no }, {
        where: {
            id: cust_id
        }
    }));

    return count;
}



// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    get_cust_details,
    signup,
    update_cust,
    login,
    logout,
    update_addr,
    update_credit_card_no,
    update_phone_no
}