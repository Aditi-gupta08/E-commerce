const Sequelize = require('sequelize');
const client = require('../mysql/client');

let cartModel = client.define( 'carts', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    customer_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'customers',
            key: 'id'
        }
    },
    product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    product_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    unit_cost: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
    },
    subtotal: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
    }
});

module.exports = cartModel;