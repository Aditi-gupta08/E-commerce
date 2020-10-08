/* const sinon = require('sinon');
const { expect } = require('chai');

const products_controller= require('../product_controller');

describe( 'Running test cases for get products', function() {

    describe('Running test case when products are available', function() {
        it('should return 4', function() {

            sinon.mock(products_controller.product_services)
            .expects( 'get_prod_by_id')
            .return([null, 4]);

            let data = products_controller.get_prod_by_id(1);
            console.log(data);
            expect(data).to.be.equal(4);
            
        });
    });

}); */