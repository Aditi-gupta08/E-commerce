const Sequelize = require('sequelize');
const client = require('../mysql/client');

let reviewModel = client.define( 'reviews', {

    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    rating: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    review: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = reviewModel;