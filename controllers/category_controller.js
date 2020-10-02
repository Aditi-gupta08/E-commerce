const { to } = require('await-to-js');

const models = require('../lib/database/mysql/index');
const joi_validtn = require('../data/joi');
const category_services = require('../services/categories');


const get_all_categories = async (req, res, next) => {

    let [err, serv] = await to(category_services.get_all_catg());
    if(err)
        return res.json({ data: null, error: err});
    let [error, CATEGORIES] = serv;

    if(error)
        return res.json({ data: null, error});

    return res.send({ data: CATEGORIES, error: null});
}


const get_catg_by_id = async(req, res, next) => {
    let [err, serv] = await to(category_services.get_category_by_id(req.params.category_id));
    if(err)
        return res.json({ data: null, error: err});
    
    let [error,CATEGORY] = serv;
    if(error)
        return res.json({ data: null, error});
    
    return res.send({ data: CATEGORY, error: null});
}


const get_catg_by_prod_id = async(req, res, next) => {
    let [err, serv] = await to(category_services.get_category_of_prod_id(req.params.product_id));
    if(err)
        return res.json({ data: null, error: err});
    
    let [error, category] = serv;
    if(error)
        return res.json({ data: null, error});
    
    return res.json({ data:category, error: null});
}


const add_catg = async(req, res, next) => {
    let category = req.body;
    let cust = res.cur_customer;

    if( cust.id != process.env.admin_id)
        return res.json({ data: null, error: "Only admins can add a category !!"});

    // Validation
    let validated = await joi_validtn.vldt_add_category.validate(category);

    if(validated && validated.error)
        return res.json({ data: null, error: validated["error"].message });

    const newCategory = models.categoryModel.build(category);
    await newCategory.save();

    return res.json({ data: "Category added successfully !", error: null});
}


// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    get_all_categories,
    get_catg_by_id,
    get_catg_by_prod_id,
    add_catg
}