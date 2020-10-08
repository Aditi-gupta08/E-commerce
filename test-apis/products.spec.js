const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

// Assertion style
chai.should();

chai.use(chaiHttp);

describe('Products APIs', () => {

    describe('GET /products', () => {

        it('should get all products', (done) => {
            chai.request(server)
            .get("/products")
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('array');

                if( res.body.data.length > 0)
                {
                    (res.body.data[0]).should.have.property('id');
                    (res.body.data[0]).should.have.property('name');
                    (res.body.data[0]).should.have.property('desc');
                    (res.body.data[0]).should.have.property('price');
                    (res.body.data[0]).should.have.property('discounted_price');
                    (res.body.data[0]).should.have.property('category_id');
                }
                done();
            });
        });
    });




    describe('GET /products/:product_id', () => {
        
        it('should get product of that id', (done) => {
            let product_id = 1;

            chai.request(server)
            .get(`/products/${product_id}`)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('object');

                (res.body.data).should.have.property('id');
                (res.body.data).should.have.property('name');
                (res.body.data).should.have.property('desc');
                (res.body.data).should.have.property('price');
                (res.body.data).should.have.property('discounted_price');
                (res.body.data).should.have.property('category_id');

                done();
            });
        });

        it('should NOT GET product of that id', (done) => {
            let product_id = 12222;

            chai.request(server)
            .get(`/products/${product_id}`)
            .end( (err, res) => {

                (res.body).should.be.a('object');
                (res.body).should.have.property('error');
                (res.body.error).should.be.a('string');
                (res.body.error).should.be.eq("No product found with this id !");

                done();
            });
        });
    });




    describe('GET /products/inCategory/:category_id', () => {
        
        it('should get product in given category id', (done) => {
            let category_id = 1;

            chai.request(server)
            .get(`/products/inCategory/${category_id}`)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('array');

                if( res.body.data.length > 0)
                {
                    (res.body.data[0]).should.have.property('id');
                    (res.body.data[0]).should.have.property('name');
                    (res.body.data[0]).should.have.property('desc');
                    (res.body.data[0]).should.have.property('price');
                    (res.body.data[0]).should.have.property('discounted_price');
                }

                done();
            });
        });


        it('should NOT get product in given category id', (done) => {
            let category_id = 40000;

            chai.request(server)
            .get(`/products/inCategory/${category_id}`)
            .end( (err, res) => {

                (res.body).should.be.a('object');
                (res.body).should.have.property('error');
                (res.body.error).should.be.a('string');
                (res.body.error).should.be.eq("No product available in this category !!");

                done();
            });
        });
    });




    describe('GET /products/:product_id/reviews', () => {
        
        it('should get product in given category id', (done) => {
            let product_id = 1;

            chai.request(server)
            .get(`/products/${product_id}/reviews`)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('array');

                if( res.body.data.length > 0)
                {
                    (res.body.data[0]).should.have.property('id');
                    (res.body.data[0]).should.have.property('product_id');
                    (res.body.data[0]).should.have.property('rating');
                    (res.body.data[0]).should.have.property('review');
                }

                done();
            });
        });


        it('should NOT get product in given category id', (done) => {
            let product_id = 50000;

            chai.request(server)
            .get(`/products/${product_id}/reviews`)
            .end( (err, res) => {

                (res.body).should.be.a('object');
                (res.body).should.have.property('error');
                (res.body.error).should.be.a('string');
                (res.body.error).should.be.eq("No reviews found for this product!");

                done();
            });
        });

    });
    

});

