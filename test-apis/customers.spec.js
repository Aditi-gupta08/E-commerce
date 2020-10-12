const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const customer_controller = require('../controllers/customer_controller');
const auth = require('../data/utils');

// Assertion style
chai.should();

chai.use(chaiHttp);

let token = fs.readFileSync('token.txt', 'utf8');

describe('Customers APIs', () => {

    /* describe('POST /customers', () => {
        const newCustomer = 
        {
            "name": "test",
            "email": "test4@gmail.com",
            "password": "12345"
        }

        it('should signup customer', (done) => {
            chai.request(server)
            .post("/customers")
            .send(newCustomer)
            .end( (err, res) => {

                console.log("--------------------");
                console.log(res.body);
                console.log("--------------------");

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('string');
                (res.body.data).should.be.eq("Customer signed up successfully !");
        
                done();
            });
        });

    }); 

    describe('GET /customers/login', () => {
        const newCustomer = 
        {
            "email": "test@gmail.com",
            "password": "12345"
        }

        it('should login customer and provide token', (done) => {
            chai.request(server)
            .get("/customers/login")
            .send(newCustomer)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('string');
                
                token = "Bearer " + res.body.data;
                done();
            });
        });
    });

    */


    describe('GET /customers', () => {

        it('should get details of cur customer', (done) => {
            chai.request(server)
            .get("/customers")
            .set("Authorization", token)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('object');

                (res.body.data).should.have.property('id');
                (res.body.data).should.have.property('name');
                (res.body.data).should.have.property('email');
                (res.body.data).should.have.property('phone_no');
                (res.body.data).should.have.property('credit_card_no');
                (res.body.data).should.have.property('addr1');
                (res.body.data).should.have.property('addr2');
                (res.body.data).should.have.property('city');
                (res.body.data).should.have.property('region');
                (res.body.data).should.have.property('postal_code');
                (res.body.data).should.have.property('country');

                done();
            });
        });
    });



    describe('Put /customers', () => {

        let updt_info_payload = {
            "name": "ss",
            "credit_card_no": "111122223388",
            "addr1": "110, h-block",
            "city": "Ghaziabad",
            "postal_code": "211911",
            "country": "India"
        };

        it("should update customer's info", (done) => {
            chai.request(server)
            .put("/customers")
            .set("Authorization", token)
            .send(updt_info_payload)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('string');
                (res.body.data).should.be.eq("Info updated successfully!!");

                done();
            });
        });
    });


    describe('Put /customers/phoneNo', () => {

        let updt_phone_payload = {
            "phone_no": "9999988888"
        };

        it("should update customer's phone no", (done) => {
            chai.request(server)
            .put("/customers/phoneNo")
            .set("Authorization", token)
            .send(updt_phone_payload)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('string');
                (res.body.data).should.be.eq("Phone no updated successfully!!");

                done();
            });
        });
    });



    describe('Put /customers/creditCard', () => {

        let updt_credit_payload = {
            "credit_card_no": 111188887788
        };

        it("should update customer's credit card number", (done) => {
            chai.request(server)
            .put("/customers/creditCard")
            .set("Authorization", token)
            .send(updt_credit_payload)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('string');
                (res.body.data).should.be.eq("Credit card no updated successfully!!");

                done();
            });
        });
    });



    describe('Put /customers/address', () => {

        let updt_address_payload = {
            "addr1": "J-88",
            "addr2": "xyz",
            "city": "Ghaziabad",
            "postal_code": "201011",
            "country": "India"
        };

        it("should update customer's address", (done) => {
            chai.request(server)
            .put("/customers/address")
            .set("Authorization", token)
            .send(updt_address_payload)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('string');
                (res.body.data).should.be.eq("Address updated successfully!!");

                done();
            });
        });
    });
   


 /*    describe('PUT /customers/logout', () => {

        it('should logout customer', (done) => {
            chai.request(server)
            .put("/customers/logout")
            .set("Authorization", token)
            .end( (err, res) => {

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('string');
                (res.body.data).should.be.eq("Logged out succesfully !!");
                token = res.body.data;

                done();
            });
        });

    });  */

});





/* 

describe('Customers APIs 2', () => {

    var verifyTokenStub;

    beforeEach(function (done) {
        verifyTokenStub = sinon.stub(auth, 'verifyToken').callsFake(
         function(req, res, next) {

            res.cur_customer = {
                "name": "test",
                "email": "test@gmail.com",
                "password": "12345"
            }
            next();
        });  

        console.log(verifyTokenStub);

        done();
    });


    describe('GET /customers using mock', () => {

        it('should get details of cur customer', (done) => {
            chai.request(server)
            .get("/customers")
            .set('token', 'anything')
            .end( (err, res) => {
                verifyTokenStub.returns(Promise.resolve(verifyToken));

                console.log("------------------------------------");
                console.log(res.body);
                console.log("------------------------------------");

                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data).should.be.a('object');

                done();
            });
        });
    });

    afterEach('cleanup', t => {
        verifyTokenStub.restore();
    })
}); */
  

    

