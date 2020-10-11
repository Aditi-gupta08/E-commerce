const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const fs = require('fs');
/* const {readToken} = require('./index.spec'); */

// Assertion style
chai.should();

chai.use(chaiHttp);

let token = fs.readFileSync('token.txt', 'utf8');

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



    describe('POST /categories', () => {

        new_category = {
            "name": "ooo",
            "desc": "kkkk"
        }

        /* token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MTMsIm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0MkBnbWFpbC5jb20ifSwiaWF0IjoxNjAyNDEzNTc2fQ.Hb9sxLXlZjMaBRJwyNgJVbtwKews_4sgVfFY_z93dQ0'
         */

        it('should add category', (done) => {
            let product_id = 1;

            chai.request(server)
            .post(`/categories`)
            .set("Authorization", token)
            .send(new_category)
            .end( (err, res) => {

                console.log("pp");

                done();
            });
        });

    });



    console.log(1);
});

