var {to} = require('await-to-js');

const models = require('../lib/database/mysql/index');


async function get_all_products()
{
    let [err, PRODUCTS] = await to(models.productModel.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']}
      }));

    let error;
    if(err)
        error = err;
    else if( PRODUCTS == [])
        error = "No product avaliable!";

    return [error, PRODUCTS];

}


async function get_prod_by_id( prod_id)
{
    let [err, PRODUCT ] = await to(models.productModel.findOne(
        {   attributes: {exclude: ['createdAt', 'updatedAt']},
            where: {
                id: prod_id
            }
        }
    ));

    let error;

    if(err)
        error = err;
    else if( PRODUCT == null )
        error = "No product found with this id !";

    return [error, PRODUCT];
}


async function get_prods_in_cat_id( cat_id)
{
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
    let error;

    if(err)
        error = err;

    if( Products.length==0)
        error= "No product available in this category !!";
    
    return [error, Products];
}


async function get_reviews_of_prod_by_id (prod_id)
{
    let [err, REVIEWS] = await to(models.reviewModel.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: { product_id: prod_id}
      }));

    if(err)
        return [err, null];

    if( REVIEWS.length == 0)
        return ['No reviews found for this product!', null];

    return [null, REVIEWS];
}


// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    get_prod_by_id,
    get_all_products,
    get_prods_in_cat_id,
    get_reviews_of_prod_by_id
}