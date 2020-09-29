const express = require('express');
const { to } = require('await-to-js');
const router = express.Router();

const models = require('../lib/database/mysql/index');
const utils = require('../data/utils');
const middlwr_caching = require('../data/middlewares/caching_functions');
const joi_validtn = require('../data/joi');
const category_services = require('../services/categories');



// Get all categories
router.get('/', middlwr_caching.caching_all_catg, async(req, res) => {

    let [err, serv] = await to(category_services.get_all_catg());
    if(err)
        return res.json({ data: null, error: err});
    let [error, CATEGORIES] = serv;

    if(error)
        return res.json({ data: null, error});

    return res.send({ data: CATEGORIES, error: null});
});


// Get category by id
router.get('/:category_id', async(req, res) => {

    let [err, serv] = await to(category_services.get_category_by_id(req.params.category_id));
    if(err)
        return res.json({ data: null, error: err});
    
    let [error,CATEGORY] = serv;
    if(error)
        return res.json({ data: null, error});
    
    return res.send({ data: CATEGORY, error: null});

});


// Get the category of a product id
router.get('/inProduct/:product_id', async(req, res) => {

    let [err, serv] = await to(category_services.get_category_of_prod_id(req.params.product_id));
    if(err)
        return res.json({ data: null, error: err});
    
    let [error, category] = serv;
    if(error)
        return res.json({ data: null, error});
    
    return res.json({ data:category, error: null});

});


// Add category   (only admins can add)
router.post('/', utils.verifyToken, async(req, res) => {
    
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
});


module.exports = router;



