const Sequelize = require('sequelize');
const client = require('../mysql/client');

let productModel = client.define( 'products', {
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
    },
    price: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
    },
    discounted_price: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
    },
    category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
});

module.exports = productModel;