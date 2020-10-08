const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

// Assertion style
chai.should();

chai.use(chaiHttp);

describe('Categories APIs', () => {

    describe('GET /categories', () => {

        it('should get all categories', (done) => {
            chai.request(server)
            .get("/categories")
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
                }

                done();
            });
        });
    });



    describe('GET /categories/:category_id', () => {
        
        it('should get category of that id', (done) => {
            let category_id = 1;

            chai.request(server)
            .get(`/categories/${category_id}`)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('object');

                (res.body.data).should.have.property('id');
                (res.body.data).should.have.property('name');
                (res.body.data).should.have.property('desc');

                done();
            });
        });

        it('should NOT GET category of that id', (done) => {
            let category_id = 12222;

            chai.request(server)
            .get(`/categories/${category_id}`)
            .end( (err, res) => {

                (res.body).should.be.a('object');
                (res.body).should.have.property('error');
                (res.body.error).should.be.a('string');
                (res.body.error).should.be.eq("No category found with this id !");

                done();
            });
        });
    });




    describe('GET /categories/inProduct/:product_id', () => {
        
        it('should get category of given product_id', (done) => {
            let product_id = 1;

            chai.request(server)
            .get(`/categories/inProduct/${product_id}`)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('object');

                (res.body.data).should.have.property('id');
                (res.body.data).should.have.property('name');
                (res.body.data).should.have.property('desc');

                done();
            });
        });


        it('should NOT get category of given product_id', (done) => {
            let product_id = 40000;

            chai.request(server)
            .get(`/categories/inProduct/${product_id}`)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('error');
                (res.body.error).should.be.a('string');
                (res.body.error).should.be.eq("No product found with this id !!");

                done();
            });
        });

    });


});

