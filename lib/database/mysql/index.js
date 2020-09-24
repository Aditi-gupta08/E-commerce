const Sequelize = require('sequelize');
const client = new Sequelize('mysql://root@localhost:3307/E-commerce');


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


let ordersProductModel = client.define( 'ordersProducts', {
    order_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'orders',
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



// --------------------------Associations--------------------------------

categoryModel.hasMany( productModel,{
    foreignKey: 'category_id'
});

productModel.belongsTo( categoryModel, {
    foreignKey: 'category_id'
});


productModel.hasMany( reviewModel, {
    foreignKey: 'product_id'
});

reviewModel.belongsTo( productModel, {
    foreignKey: 'product_id'
});


// Shopping cart

productModel.hasMany( cartModel, {
    foreignKey: 'product_id'
});

cartModel.belongsTo( productModel, {
    foreignKey: 'product_id'
});

customerModel.hasMany( cartModel, {
    foreignKey: 'customer_id'
});

cartModel.belongsTo( customerModel, {
    foreignKey: 'customer_id'
});


// Orders 

customerModel.hasMany( orderModel, {
    foreignKey: 'customer_id'
});

orderModel.belongsTo( customerModel, {
    foreignKey: 'customer_id'
});


// Orders Products

orderModel.hasMany( ordersProductModel, {
    foreignKey: 'order_id'
});

ordersProductModel.belongsTo( orderModel, {
    foreignKey: 'order_id'
});


const connectMysql = async() => {
    await client.sync({ alter: false});
    //await client.sync();
};


module.exports = {
    connectMysql,
    customerModel,
    categoryModel,
    productModel,
    reviewModel,
    cartModel,
    orderModel,
    ordersProductModel
}