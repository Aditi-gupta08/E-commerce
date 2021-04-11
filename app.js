var express = require('express');
const {to} = require('await-to-js');
const models = require('./lib/database/mysql/index');

const customerRouter = require('./routes/customers');
const categoryRouter = require('./routes/categories');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders');
const shoppingCartRouter = require('./routes/shopping_cart');

const alert = require('./lib/alert/sentry');
const logger = require('./lib/logging/winston_logger');
const cache = require('./lib/cache/redis');
var app = express();

function main() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  alert();
  models.connectMysql();

  app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept, X-Custom-Header');
    res.setHeader('Access-Control-Allow-Headers', "Authorization, Accept, Content-Type");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
  
  // Routes
  app.use('/customers', customerRouter);
  app.use('/categories', categoryRouter);
  app.use('/products', productRouter);
  app.use('/orders', orderRouter);
  app.use('/shoppingcart', shoppingCartRouter);
  
  cache.connectRedis();
};



main();

module.exports = app;
