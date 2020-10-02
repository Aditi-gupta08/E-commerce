const { to } = require('await-to-js');

const models = require('../lib/database/mysql/index');
const utils = require('../data/utils');
const product_services = require('../services/products');
const cache = require('../lib/cache/redis');
const joi_validtn = require('../data/joi');


const get_all_products = async (req, res, next) => {
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
    
    return res.json({ data: PRODUCTS, error});
}


const get_prod_by_id = async (req, res, next) => {
    let prod_id = req.params.product_id;

    let [err, serv] = await to(product_services.get_prod_by_id(prod_id) );

    if(err)
        return res.json({data: null, error: err});
    let [error, data] = serv;

    if(error)
        return res.json({data: null, error });
    
    return res.json({ data, error});
}


const add_product = async (req, res, next) => {
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

    let [err, data] = await to( newProduct.save());

    if(err)
        return res.json({ data: null, error: err });

    return res.json({ data: "Product added successfully !", error: null});
}


const search_prod_by_name = async (req, res, next) => {
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

    return res.json({ data: PRODUCTS, error: null});
}


const get_prod_in_catg_id = async (req, res, next) => {
    let cat_id = req.params.category_id;

    let [err, serv] = await to(product_services.get_prods_in_cat_id(cat_id) );
    if(err)
        return res.json({data: null, error: err});


    let [error, PRODUCTS] = serv;
    if(error)
        return res.json({data: null, error });

    return res.json({ data:PRODUCTS, error: null});
}


const get_all_reviews = async (req, res, next) => {
    let prod_id = req.params.product_id;
    let [err, serv] = await to(product_services.get_reviews_of_prod_by_id( prod_id ) );
    if(err)
        return res.json({data: null, error: err});

    let [error, REVIEWS] = serv;
    if(error)
        return res.json({data: null, error });

    return res.send({ data: REVIEWS, error: null});
}


const add_review = async (req, res, next) => {
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
    let validated = await joi_validtn.vldt_add_review.validate(rev);

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
}





// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    get_all_products,
    get_prod_by_id,
    add_product,
    search_prod_by_name,
    get_prod_in_catg_id,
    get_all_reviews,
    add_review
}
