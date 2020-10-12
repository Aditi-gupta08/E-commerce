const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const auth = require('../data/utils');

// Assertion style
chai.should();

chai.use(chaiHttp);

let token;

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
            console.log(token);
            fs.writeFileSync('token.txt', token, (err) => console.error(err))
            done();
        });
    });
});


require('./categories.spec');
require('./customers.spec');
require('./products.spec'); 


describe('PUT /customers/logout', () => {

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

});


