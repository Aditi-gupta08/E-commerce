const sinon = require('sinon');
const { expect } = require('chai');

const { factorial } = require('../factorial');

describe( 'Running test cases for factorial', function() {

    describe('Running positive test cases for factorial', function() {
        it('should return 120 if number is 5', function() {
            let x = factorial(5);
            console.log(x);
            expect(x).to.be.equal(120);
        });
    });

    describe( 'Running negative test cases for factorial', function() {
        it( 'should return error if number is negative', function() {
            let y= factorial(-1);
            expect(y).to.be.instanceOf(Error);
        });

        it( 'should return 1 if number is 0', function() {
            let z= factorial(0);
            expect(z).to.be.equal(1);
        });
    });

});
/* 
"test": "./node_modules/.bin/nyc ./node_modules/.bin/mocha './{,!(node_modules)/**}/*.spec.js'" */

/* 
"test": "env-cmd -f data/variables.env mocha test-apis" */