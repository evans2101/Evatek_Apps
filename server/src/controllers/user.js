// import required models
const { User, Profile, Order, Transaction, Product } = require("../../models");
// import joi
const Joi = require("joi");
// import bcrypt
const bcrypt = require("bcrypt");
// generate salt
const salt = bcrypt.genSaltSync(10);

// get users
exports.getUsers = (req, res) => {
  try {
    User.findAll({
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: ["phone", "gender", "address", "postCode"],
        },
        {
          model: Order,
          as: "orders",
          attributes: ["id", "qty"],
          include: [
            {
              model: Transaction,
              as: "transaction",
              attributes: ["id", "status", "totalPrice"],
            },
            {
              model: Product,
              as: "product",
              attributes: ["id", "title", "price", "image"],
            },
          ],
        },
      ],
      attributes: ["id", "fullName", "email", "image"],
    }).then((users) => {
      users = JSON.parse(JSON.stringify(users));
      users = users.map((user) => {
        if (user.image) {
          return {
            ...user,
            image: process.env.FILE_PATH + user.image,
          };
        }
        return user;
      });
      res.send({
        status: "success",
        data: { users },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// get user by id
exports.getUserById = (req, res) => {
  try {
    User.findByPk(req.params.id, {
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: ["phone", "gender", "address", "postCode"],
        },
        {
          model: Order,
          as: "orders",
          attributes: ["id", "qty"],
          include: [
            {
              model: Transaction,
              as: "transaction",
              attributes: ["id", "status", "totalPrice"],
            },
            {
              model: Product,
              as: "product",
              attributes: ["id", "title", "price", "image"],
            },
          ],
        },
      ],
      attributes: ["id", "fullName", "email", "image"],
    }).then((user) => {
      if (!user) {
        res.status(404).send({
          status: "error",
          message: "User not found",
        });
        return;
      }
      user = JSON.parse(JSON.stringify(user));
      if (user.image) {
        user.image = process.env.FILE_PATH + user.image;
      } else {
        user.image = null;
      }
      res.send({
        status: "success",
        data: { user },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// add user
exports.addUser = (req, res) => {
  try {
    // validate request
    const schema = Joi.object().keys({
      fullName: Joi.string().min(4).required(),
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(8).required(),
    });
    const { error } = schema.validate(req.body);
    if (error && error.details) {
      res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });
      return;
    }
    // hash password
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
    }).then((user) => {
      res.send({
        status: "success",
        data: { user },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// update user
exports.updateUser = (req, res) => {
  try {
    // hash password
    if (req.body.password) {
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    let filename = null;
    try {
      filename = req.file.filename;
    } catch (e) {
      filename = req.body.image;
    }
    User.update(
      {
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        image: filename,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then((user) => {
      res.send({
        status: "success",
        data: {
          id: req.params.id,
        },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// delete user
exports.deleteUser = (req, res) => {
  try {
    User.destroy({
      where: {
        id: req.params.id,
      },
    }).then((user) => {
      if (!user) {
        res.status(404).send({
          status: "error",
          message: "User not found",
        });
        return;
      }
      res.send({
        status: "success",
        data: {
          id: req.params.id,
        },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};
