const Sequelize = require('sequelize');

const client = new Sequelize('mysql://root@localhost:3307/E-commerce', {logging: false});

module.exports = client;