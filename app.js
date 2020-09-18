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


var app = express();

// Alerting
alert();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/*
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); */


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

module.exports = app;
