"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Order.belongsTo(models.Transaction, {
        foreignKey: "transactionId",
        as: "transaction",
      });
      Order.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
      Order.belongsToMany(models.Topping, {
        as: "toppings",
        through: {
          model: "OrderTopping",
          as: "orderToppings",
        },
        foreignKey: "orderId",
      });
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      transactionId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
