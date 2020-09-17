const express = require('express');
const router = express.Router();
const models = require('../lib/database/mysql/index');
const { to } = require('await-to-js');
const utils = require('../data/utils');
const Sequelize = require('sequelize');
const { reviewModel } = require('../lib/database/mysql/index');


// Get all products
router.get('/', async(req, res) => {

    let [err, PRODUCTS] = await to(models.productModel.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']}
      }));

    if(err)
        return res.json({ data: null, error: err});

    return res.send({ data: PRODUCTS, error: null});
});



// Add product    (only admins can add)
router.post('/:category_id', utils.verifyToken, async(req, res) => {
    
    let prod = req.body;
    let cat_id = req.params.category_id;

    if( cust.id != utils.admin_id)
    {
        return res.json({ data: null, error: "Only admins can add a category !!"});
    }

    // Validation
    let validated = await utils.vldt_add_products.validate(prod);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    }

    prod.category_id = cat_id;

    // find course or create new one
    const newProduct = models.productModel.build(prod);

    await newProduct.save();

    return res.json({ data: "Product added successfully !", error: null});
});




// Get product by id
router.get('/:product_id', async(req, res) => {
    let prod_id = req.params.product_id;

    let [err, PRODUCT] = await to(models.productModel.findOne(
        {   attributes: {exclude: ['createdAt', 'updatedAt']},
            where: {
            id: prod_id
            }
        }
    ));

    if(err)
        return res.json({data: null, error: err});

    if( PRODUCT == null)
        return res.json({ data: null, error: "No product found with this id !"});
    
    return res.send({ data: PRODUCT, error: null});

});




// Search products
router.get('/search', async(req, res) => {
    let prod_name = req.body.name;

    let [err, PRODUCTS] = await to(models.productModel.findAll(
        {   attributes: {exclude: ['createdAt', 'updatedAt']} ,
            where: {
            /* name: prod_name */
            name: {
                [Sequelize.Op.like]: `%${prod_name}%`
            } 
            }
        }
    ));

    if(err)
        return res.json({data: null, error: err});

    if( PRODUCTS.length == 0 )
        return res.json({ data: null, error: "No product found with this name !"});

    
    
    return res.send({ data: PRODUCTS, error: null});

});



// Get products in the category id
router.get('/inCategory/:category_id', async(req, res) => {

    let cat_id = req.params.category_id;

    let [err, Products] = await to(models.productModel.findAll(
        {   
            where: {
                category_id: cat_id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'category_id']
            }
        }
    ));

    console.log(Products);

    if(err)
        return res.json({ data: null, error: err});

    if( Products.length==0)
        return res.json({ data:null, error: 'No product available in this category !'});

    return res.json({ data:Products, error: null});
});



// Get all reviews of a product
router.get('/:product_id/reviews', async(req, res) => {

    let prod_id = req.params.product_id;
    let [err, REVIEWS] = await to(models.reviewModel.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: { product_id: prod_id}
      }));

    if(err)
        return res.json({ data: null, error: err});

    if( REVIEWS.length == 0)
        return res.json({ data:null, error: 'No reviews found for this product!'});

    return res.send({ data: REVIEWS, error: null});

});


// Add reviews for a product
router.post('/:product_id/reviews', async(req, res) => {
    
    let rev = req.body;
    let prod_id = req.params.product_id;

    // Validation
    let validated = await utils.vldt_add_review.validate(rev);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    }


    // find course or create new one
    const newReview = models.reviewModel.build({
      product_id: prod_id,
      rating: rev.rating,
      review: rev.review
    });

    await newReview.save();

    return res.json({ data: "Review added successfully !", error: null});
});



module.exports = router;