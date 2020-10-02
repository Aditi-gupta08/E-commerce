const Sequelize = require('sequelize');
const client = require('../mysql/client');

let categoryModel = client.define( 'categories', {

    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    desc: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports = categoryModel;