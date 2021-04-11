const sinon = require('sinon');
const { expect } = require('chai');
const { assert } = require('chai')

const product_services = require('../products');

describe( 'Running test cases for PRODUCTS SERVICES', function() {

    describe('Running test cases for get product by id', function() {
        it('should return some data if id = 1', async function() {
            let [err, data] = await product_services.get_prod_by_id(1);
            /* console.log(data.dataValues); */

            expect(err).to.be.equal(undefined);
            expect(data).to.not.be.equal(undefined);

            assert.isObject(data);
            assert.isObject(data.dataValues);
            assert.property(data.dataValues, 'id');
            assert.property(data.dataValues, 'name');
            assert.property(data.dataValues, 'desc');
            assert.property(data.dataValues, 'price');
            assert.property(data.dataValues, 'category_id');
        });

        it('should return error if id = 200000', async function() {

            console.log(data);

            let [err, data] = await product_services.get_prod_by_id(20000);

            expect(err).to.not.be.equal(undefined);
            assert.isString(err);
            assert.equal(err, 'No product found with this id !');  
        });
    });

});