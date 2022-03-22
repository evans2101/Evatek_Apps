// import required models
const { User } = require("../../models");
// import joi
const Joi = require("joi");
// import bcrypt
const bcrypt = require("bcrypt");
// import jwt
const jwt = require("jsonwebtoken");

// Register user
exports.register = async (req, res) => {
  try {
    // validate request body
    const schema = Joi.object().keys({
      fullName: Joi.string().min(4).required(),
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(8).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(401).send({
        status: "error",
        message: error.details[0].message,
      });
      return;
    }
    // check if user already exists
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      res.status(401).send({
        status: "error",
        message: "User already exists",
      });
      return;
    }
    // generate salt
    const salt = await bcrypt.genSalt(10);
    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // create new user
    const newUser = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
    });
    // generate token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.send({
      status: "success",
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    // validate request body
    const schema = Joi.object().keys({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(8).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(401).send({
        status: "error",
        message: error.details[0].message,
      });
      return;
    }
    // check if user exists
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      res.status(401).send({
        status: "error",
        message: "Email or password is incorrect",
      });
      return;
    }
    // check if password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(401).send({
        status: "error",
        message: "Email or password is incorrect",
      });
      return;
    }
    // generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.send({
      status: "success",
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// Check auth
exports.checkAuth = async (req, res) => {
  try {
    // check if user is logged in
    if (!req.user) {
      res.status(401).send({
        status: "error",
        message: "Unauthorized",
      });
      return;
    }
    res.send({
      status: "success",
      data: {
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};
