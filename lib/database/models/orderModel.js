const Sequelize = require('sequelize');
const client = require('../mysql/client');


let orderModel = client.define( 'orders', {

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
    subtotal: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    orderDate: {
        type: Sequelize.STRING
    },
    deliveryDate: {
        type: Sequelize.STRING
    },
    paymentDone: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
    
});


module.exports = orderModel;
