"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Topping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Topping.belongsToMany(models.Order, {
        as: "orders",
        through: {
          model: "OrderTopping",
          as: "orderToppings",
        },
        foreignKey: "toppingId",
      });
    }
  }
  Topping.init(
    {
      title: DataTypes.STRING,
      price: DataTypes.INTEGER,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Topping",
    }
  );
  return Topping;
};
