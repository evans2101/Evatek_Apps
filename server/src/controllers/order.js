// import required models
const {
  Order,
  User,
  Transaction,
  Product,
  OrderTopping,
  Topping,
} = require("../../models");

// get all orders
exports.getOrders = (req, res) => {
  try {
    Order.findAll({
      attributes: ["id", "qty", "totalPrice"],
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
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "image"],
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
    }).then((orders) => {
      orders = JSON.parse(JSON.stringify(orders));
      orders = orders.map((order) => {
        return {
          ...order,
          product: {
            ...order.product,
            image: process.env.FILE_PATH + order.product.image,
          },
          user: {
            ...order.user,
            image: process.env.FILE_PATH + order.user.image,
          },
        };
      });
      res.send({
        status: "success",
        data: { orders },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// get order by id
exports.getOrderById = (req, res) => {
  try {
    Order.findByPk(req.params.id, {
      attributes: ["id", "qty", "totalPrice"],
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
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "image"],
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
    }).then((order) => {
      if (!order) {
        res.status(404).send({
          status: "error",
          message: "Order not found",
        });
        return;
      }
      order = JSON.parse(JSON.stringify(order));
      res.send({
        status: "success",
        data: {
          ...order,
          product: {
            ...order.product,
            image: process.env.FILE_PATH + order.product.image,
          },
          user: {
            ...order.user,
            image: process.env.FILE_PATH + order.user.image,
          },
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

// get orders by transaction id
exports.getOrdersByTransactionId = (req, res) => {
  try {
    Order.findAll({
      attributes: ["id", "qty", "totalPrice"],
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
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "image"],
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
      where: {
        transactionId: req.params.transactionId,
      },
    }).then((orders) => {
      if (!orders) {
        res.status(404).send({
          status: "error",
          message: "Orders not found",
        });
        return;
      }
      orders = JSON.parse(JSON.stringify(orders));
      orders = orders.map((order) => {
        return {
          ...order,
          product: {
            ...order.product,
            image: process.env.FILE_PATH + order.product.image,
          },
          user: {
            ...order.user,
            image: process.env.FILE_PATH + order.user.image,
          },
        };
      });
      res.send({
        status: "success",
        data: { orders },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// get orders by user id
exports.getOrdersByUserId = (req, res) => {
  try {
    Order.findAll({
      attributes: ["id", "qty", "totalPrice"],
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
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "image"],
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
      where: {
        userId: req.params.userId,
      },
    }).then((orders) => {
      if (!orders) {
        res.status(404).send({
          status: "error",
          message: "Orders not found",
        });
        return;
      }
      orders = JSON.parse(JSON.stringify(orders));
      orders = orders.map((order) => {
        return {
          ...order,
          product: {
            ...order.product,
            image: process.env.FILE_PATH + order.product.image,
          },
          user: {
            ...order.user,
            image: process.env.FILE_PATH + order.user.image,
          },
        };
      });
      res.send({
        status: "success",
        data: { orders },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// add order
exports.addOrder = (req, res) => {
  try {
    Order.create(req.body).then((order) => {
      res.send({
        status: "success",
        data: { order },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// update order
exports.updateOrder = (req, res) => {
  try {
    Order.findByPk(req.params.id).then((order) => {
      if (!order) {
        res.status(404).send({
          status: "error",
          message: "Order not found",
        });
        return;
      }
      order.update(req.body).then((order) => {
        res.send({
          status: "success",
          data: {
            id: req.params.id,
          },
        });
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// delete order
exports.deleteOrder = (req, res) => {
  try {
    Order.findByPk(req.params.id).then((order) => {
      if (!order) {
        res.status(404).send({
          status: "error",
          message: "Order not found",
        });
        return;
      }
      order.destroy().then(() => {
        res.send({
          status: "success",
          data: {
            id: req.params.id,
          },
        });
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};
