const {
  Transaction,
  User,
  Order,
  Product,
  Profile,
  Topping,
  OrderTopping,
} = require("../../models");

// get all transactions
exports.getTransactions = (req, res) => {
  try {
    Transaction.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
          include: [
            {
              model: Profile,
              as: "profile",
              attributes: ["gender", "address", "phone", "postCode"],
            },
          ],
        },
        {
          model: Order,
          as: "orders",
          attributes: ["id", "qty", "totalPrice"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "title", "price", "image"],
            },
            {
              model: Topping,
              as: "toppings",
              through: {
                model: OrderTopping,
                as: "orderToppings",
                attributes: [],
              },
              attributes: ["id", "title", "price"],
            },
          ],
        },
      ],
      attributes: ["id", "status", "totalPrice", "image", "createdAt"],
    }).then((transactions) => {
      // add FILE_PATH to each transaction orders product image
      transactions.forEach((transaction) => {
        transaction.orders.forEach((order) => {
          order.product.image = process.env.FILE_PATH + order.product.image;
        });
      });
      res.send({
        status: "success",
        data: { transactions },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// get transactions by user id
exports.getTransactionsByUserId = (req, res) => {
  try {
    Transaction.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
          include: [
            {
              model: Profile,
              as: "profile",
              attributes: ["gender", "address", "phone", "postCode"],
            },
          ],
        },
        {
          model: Order,
          as: "orders",
          attributes: ["id", "qty", "totalPrice"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "title", "price", "image"],
            },
            {
              model: Topping,
              as: "toppings",
              through: {
                model: OrderTopping,
                as: "orderToppings",
                attributes: [],
              },
              attributes: ["id", "title", "price"],
            },
          ],
        },
      ],
      attributes: ["id", "status", "totalPrice", "image", "createdAt"],
      where: {
        userId: req.params.userId,
      },
    }).then((transactions) => {
      if (transactions.length === 0) {
        res.status(404).send({
          status: "error",
          message: "User not found",
        });
        return;
      }
      // add FILE_PATH to each transaction orders product image
      transactions.forEach((transaction) => {
        transaction.orders.forEach((order) => {
          order.product.image = process.env.FILE_PATH + order.product.image;
        });
      });
      res.send({
        status: "success",
        data: { transactions },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// get transaction by id
exports.getTransactionById = (req, res) => {
  try {
    Transaction.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
          include: [
            {
              model: Profile,
              as: "profile",
              attributes: ["gender", "address", "phone", "postCode"],
            },
          ],
        },
        {
          model: Order,
          as: "orders",
          attributes: ["id", "qty", "totalPrice"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "title", "price", "image"],
            },
            {
              model: Topping,
              as: "toppings",
              through: {
                model: OrderTopping,
                as: "orderToppings",
                attributes: [],
              },
              attributes: ["id", "title", "price"],
            },
          ],
        },
      ],
      attributes: ["id", "status", "totalPrice", "image", "createdAt"],
    }).then((transaction) => {
      if (!transaction) {
        res.status(404).send({
          status: "error",
          message: "Transaction not found",
        });
        return;
      }
      // add FILE_PATH to each order product image
      transaction.orders.forEach((order) => {
        order.product.image = process.env.FILE_PATH + order.product.image;
      });
      // add FILE_PATH to transaction invoice image if exist
      if (transaction.image) {
        transaction.image = process.env.FILE_PATH + transaction.image;
      }
      res.send({
        status: "success",
        data: { transaction },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// add transaction
exports.addTransaction = (req, res) => {
  try {
    Transaction.create({
      userId: req.body.userId,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      image: req.file.filename,
    }).then((transaction) => {
      res.send({
        status: "success",
        data: { transaction },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// update transaction
exports.updateTransaction = (req, res) => {
  try {
    Transaction.update(
      {
        status: req.body.status,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then((transaction) => {
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

// delete transaction
exports.deleteTransaction = (req, res) => {
  try {
    Transaction.destroy({
      where: {
        id: req.params.id,
      },
    }).then((transaction) => {
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
