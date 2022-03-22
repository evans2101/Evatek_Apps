"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {
        foreignKey: "userId",
        as: "profile",
      });
      User.hasMany(models.Order, {
        foreignKey: "userId",
        as: "orders",
      });
      User.hasMany(models.Chat, {
        as: "recipientMessage",
        foreignKey: "recipientId",
      });
      User.hasMany(models.Chat, {
        as: "senderMessage",
        foreignKey: "senderId",
      });
    }
  }
  User.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
