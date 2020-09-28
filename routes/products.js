const express = require('express');
const { to } = require('await-to-js');
const router = express.Router();

const models = require('../lib/database/mysql/index');
const utils = require('../data/utils');
const product_services = require('../services/products');
const cache = require('../lib/cache/redis');
const middlwr_caching = require('../data/middlewares/caching_functions');
const joi_validtn = require('../data/joi');



// Get all products using caching
router.get('/all', middlwr_caching.caching_all_prod ,async(req, res) => {
    let [err, serv] = await to(product_services.get_all_products());

    if(err)
        return res.json({data: null, error: err});
    let [error, PRODUCTS] = serv;

    if(error)
        return res.json({data: null, error });

    let PROD = JSON.stringify( PRODUCTS, null, 0);

    let data;
    [err, data] = await to(cache.setValue("All_Products", PROD));
    if(err)
        return res.json({ data: null, error: "Eror in setting value in Redis !!"});
    
    return res.send({ data: PRODUCTS, error});
});



// Get all products
router.get('/', async(req, res) => {

    let [err, serv] = await to(product_services.get_all_products());

    if(err)
        return res.json({data: null, error: err});
    let [error, PRODUCTS] = serv;

    if(error)
        return res.json({data: null, error });
    
    return res.send({ data: PRODUCTS, error});
});




// Add product    (only admins can add)
router.post('/:category_id', utils.verifyToken, async(req, res) => {
    
    let prod = req.body;
    let cat_id = req.params.category_id;
    let cust = res.cur_customer;

    if( cust.id != process.env.admin_id)
    {
        return res.json({ data: null, error: "Only admins can add a category !!"});
    }

    // Validation
    let validated = await joi_validtn.vldt_add_products.validate(prod);

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

    let [err, serv] = await to(product_services.get_prod_by_id(prod_id) );

    if(err)
        return res.json({data: null, error: err});
    let [error, data] = serv;

    if(error)
        return res.json({data: null, error });
    
    return res.send({ data, error});
    
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

    let [err, serv] = await to(product_services.get_prods_in_cat_id(cat_id) );
    if(err)
        return res.json({data: null, error: err});


    let [error, PRODUCTS] = serv;
    if(error)
        return res.json({data: null, error });

    return res.json({ data:PRODUCTS, error: null});
});


// Get all reviews of a product
router.get('/:product_id/reviews', async(req, res) => {

    let prod_id = req.params.product_id;
    let [err, serv] = await to(product_services.get_reviews_of_prod_by_id( prod_id ) );
    if(err)
        return res.json({data: null, error: err});

    let [error, REVIEWS] = serv;
    if(error)
        return res.json({data: null, error });

    return res.send({ data: REVIEWS, error: null});

});


// Add reviews for a product
router.post('/:product_id/reviews', utils.verifyToken, async(req, res) => {
    
    let cust = res.cur_customer;
    let rev = req.body;
    let prod_id = req.params.product_id;

    let [err, ORDERS] = await to(models.orderModel.findAll(
        {   attributes: {exclude: ['createdAt', 'updatedAt', 'customer_id']},
            where: {
            customer_id: cust.id
            },
            include: [{   model: models.ordersProductModel,
                where: {
                    product_id: prod_id
                },
                attributes: {exclude: ['createdAt', 'updatedAt', 'order_id', 'id']}
            }]
        }
    ));

    if( ORDERS.length == 0)
        return res.json({ data: null, error: "You are no allowed to give review for this product!! As you haven't bought it yet !"});

    // Validation
    let validated = await utils.vldt_add_review.validate(rev);

    if(validated && validated.error)
    {
        return res.json({ data: null, error: validated["error"].message });
    }


    const newReview = models.reviewModel.build({
      product_id: prod_id,
      rating: rev.rating,
      review: rev.review
    });

    await newReview.save();

    return res.json({ data: "Review added successfully !", error: null});
});



module.exports = router;