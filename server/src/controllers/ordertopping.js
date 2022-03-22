// import required models
const { OrderTopping, Order } = require("../../models");

// add order topping pivot
exports.addOrderTopping = (req, res) => {
  try {
    OrderTopping.create(req.body).then((orderTopping) => {
      res.send({
        status: "success",
        data: { orderTopping },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// delete order topping pivot
exports.deleteOrderTopping = (req, res) => {
  try {
    OrderTopping.destroy({
      where: {
        orderId: req.body.orderId,
        toppingId: req.body.toppingId,
      },
    }).then((orderTopping) => {
      if (!orderTopping) {
        res.status(404).send({
          status: "error",
          message: "Order not found",
        });
        return;
      }
      res.send({
        status: "success",
        data: {
          orderId: req.body.orderId,
          toppingId: req.body.toppingId,
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

// delete order topping pivot by order id
exports.deleteOrderToppingByOrderId = (req, res) => {
  try {
    OrderTopping.destroy({
      where: {
        orderId: req.params.orderId,
      },
    }).then((orderTopping) => {
      if (!orderTopping) {
        res.status(404).send({
          status: "error",
          message: "Order not found",
        });
        return;
      }
      res.send({
        status: "success",
        data: {
          orderId: req.params.id,
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
