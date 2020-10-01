const Sequelize = require('sequelize');
const client = require('../mysql/client');

let customerModel = client.define( 'customers', {

    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    encrypted_pass: {
        type: Sequelize.STRING,
        allowNull: false
    },
    login_status: {
        type: Sequelize.BOOLEAN
    },
    phone_no: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
    },
    credit_card_no: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
    },
    addr1: {
        type: Sequelize.STRING,
        allowNull: true
    },
    addr2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    city: {
        type: Sequelize.STRING,
        allowNull: true
    },
    region: {
        type: Sequelize.STRING,
        allowNull: true
    },
    postal_code: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
    },
    country: {
        type: Sequelize.STRING,
        allowNull: true
    }

});

module.exports = customerModel;