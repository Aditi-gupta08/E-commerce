var {to} = require('await-to-js');

const models = require('../lib/database/mysql/index');
const cache = require('../lib/cache/redis');


async function get_all_catg()
{
    let [err, CATEGORIES] = await to(models.categoryModel.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']}
      }));

    if(err)
        return [err, null];

    if(CATEGORIES.length === 0)
        return ["No category !!", null];

    let data;
    [err, data] = await to(cache.setValue("All_Categories", JSON.stringify( CATEGORIES, null, 0)));
    if(err)
        return ["Eror in setting value in Redis !!", null];

    return [null, CATEGORIES];
}


async function get_category_by_id( cat_id)
{
    let [err, CATEGORY] = await to(models.categoryModel.findOne(
        {   attributes: {exclude: ['createdAt', 'updatedAt']}  ,
            where: {
            id: cat_id
            }
        }
    ));

    if(err)
        return [err, null];

    if( CATEGORY == null)
        return ["No category found with this id !", null];

    return [null, CATEGORY];
}


async function get_category_of_prod_id( prod_id )
{
    let [err, Product] = await to(models.productModel.findAll(
        {   
            where: {id: prod_id},
            include: [{   model: models.categoryModel}]
        }
    ));

    if(err)
        return [err, null];

    if(Product.length === 0)
        return ["No product found with this id !!", null];

    let {id, name, desc} = Product[0].dataValues.category.dataValues;
    let category = { id, name, desc};

    return [null, category];
}


// --------------------------------------------------------Exports---------------------------------------------------------------
module.exports = {
    get_all_catg,
    get_category_by_id,
    get_category_of_prod_id
}