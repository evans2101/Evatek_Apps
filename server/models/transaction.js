"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Transaction.hasMany(models.Order, {
        foreignKey: "transactionId",
        as: "orders",
      });
    }
  }
  Transaction.init(
    {
      userId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      totalPrice: DataTypes.INTEGER,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
