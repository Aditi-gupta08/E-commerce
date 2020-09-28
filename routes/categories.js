const express = require('express');
const { to } = require('await-to-js');
const router = express.Router();

const models = require('../lib/database/mysql/index');
const utils = require('../data/utils');
const cache = require('../lib/cache/redis');
const middlwr_caching = require('../data/middlewares/caching_functions');
const joi_validtn = require('../data/joi');


// Get all categories
router.get('/', middlwr_caching.caching_all_catg, async(req, res) => {

    let [err, CATEGORIES] = await to(models.categoryModel.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']}
      }));

    if(err)
        return res.json({ data: null, error: err});

    let CATG = JSON.stringify( CATEGORIES, null, 0);

    let data;
    [err, data] = await to(cache.setValue("All_Categories", CATG));
    if(err)
        return res.json({ data: null, error: "Eror in setting value in Redis !!"});

    return res.send({ data: CATEGORIES, error: null});
});


// Get category by id
router.get('/:category_id', async(req, res) => {
    let cat_id = req.params.category_id;

    let [err, CATEGORY] = await to(models.categoryModel.findOne(
        {   attributes: {exclude: ['createdAt', 'updatedAt']}  ,
            where: {
            id: cat_id
            }
        }
    ));

    if(err)
        return res.json({data: null, error: err});

    if( CATEGORY == null)
        return res.json({ data: null, error: "No category found with this id !"});
    
    return res.send({ data: CATEGORY, error: null});

});


// Get the category of a product id
router.get('/inProduct/:product_id', async(req, res) => {

    let prod_id = req.params.product_id;

    let [err, Product] = await to(models.productModel.findAll(
        {   
            where: {id: prod_id},
            include: [{   model: models.categoryModel }]
        }
    ));

    if(err)
        return res.json({ data: null, error: err});

    let {id, name, desc} = Product[0].dataValues.category.dataValues;
    let category = { id, name, desc}

    return res.json({ data:category, error: null});

});


// Add category   (only admins can add)
router.post('/', utils.verifyToken, async(req, res) => {
    
    let category = req.body;
    let cust = res.cur_customer;

    if( cust.id != process.env.admin_id)
    {
        return res.json({ data: null, error: "Only admins can add a category !!"});
    }

    // Validation
    let validated = await joi_validtn.vldt_add_category.validate(category);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    }

    const newCategory = models.categoryModel.build(category);

    await newCategory.save();

    return res.json({ data: "Category added successfully !", error: null});
});


module.exports = router;



