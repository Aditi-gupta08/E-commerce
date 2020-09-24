var createError = require('http-errors');
var express = require('express');
const {to} = require('await-to-js');
const models = require('./lib/database/mysql/index');

const customerRouter = require('./routes/customers');
const categoryRouter = require('./routes/categories');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders');
const shoppingCartRouter = require('./routes/shopping_cart');

const alert = require('./lib/alerting/sentry');
/* const logger = require('./lib/logging/logfly_logger');
const { accessLoggerMW } = require("my-logger"); */

const logger = require('./lib/logging/winston_logger');
const cache = require('./lib/cache/redis');


var app = express();

// Alerting
/* alert(); */


app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// Connecting to DB
let connect = async() => {
  let [err, data] = await to( models.connectMysql());
  if(err)
    logger.error("Error:", err);
  else
    logger.info('CONNECTED');
}


connect();

// Routes
app.use('/customers', customerRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/shoppingcart', shoppingCartRouter);

/* let caching = async () => {
  let [err, data] = await to( cache.connectRedis());

  if(err)
    logger.error(err);
  else
    logger.info(data);
}

caching(); */

cache.connectRedis();


module.exports = app;
