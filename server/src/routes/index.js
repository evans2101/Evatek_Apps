const express = require("express");

const router = express.Router();

// Middleware
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

// Controllers

// user
const {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
// profile
const { addProfile, updateProfile } = require("../controllers/profile");
// product
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
// transaction
const {
  getTransactions,
  getTransactionsByUserId,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transaction");
// topping
const {
  getToppings,
  getToppingById,
  addTopping,
  updateTopping,
  deleteTopping,
} = require("../controllers/topping");
// order
const {
  getOrders,
  getOrderById,
  getOrdersByTransactionId,
  getOrdersByUserId,
  addOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order");
// order topping pivot
const {
  addOrderTopping,
  deleteOrderTopping,
  deleteOrderToppingByOrderId,
} = require("../controllers/orderTopping");
// auth
const { login, register, checkAuth } = require("../controllers/auth");

// Routes

// user
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", addUser);
router.patch("/users/:id", uploadFile("image"), updateUser);
router.delete("/users/:id", deleteUser);
// profile
router.post("/profiles", uploadFile("image"), addProfile);
router.patch("/profiles/:userId", uploadFile("image"), updateProfile);
// product
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.post("/products", uploadFile("image"), addProduct);
router.patch("/products/:id", uploadFile("image"), updateProduct);
router.delete("/products/:id", deleteProduct);
// transaction
router.get("/transactions", auth, getTransactions);
router.get("/transactions/user/:userId", auth, getTransactionsByUserId);
router.get("/transactions/:id", auth, getTransactionById);
router.post("/transactions", auth, uploadFile("image"), addTransaction);
router.patch("/transactions/:id", auth, updateTransaction);
router.delete("/transactions/:id", auth, deleteTransaction);
// topping
router.get("/toppings", getToppings);
router.get("/toppings/:id", getToppingById);
router.post("/toppings", uploadFile("image"), addTopping);
router.patch("/toppings/:id", uploadFile("image"), updateTopping);
router.delete("/toppings/:id", deleteTopping);
// order
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.get("/orders/transaction/:transactionId", getOrdersByTransactionId);
router.get("/orders/user/:userId", getOrdersByUserId);
router.post("/orders", addOrder);
router.patch("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);
// order topping pivot
router.post("/order-toppings", addOrderTopping);
router.delete("/order-toppings/", deleteOrderTopping);
router.delete("/order-toppings/:orderId", deleteOrderToppingByOrderId);
// auth
router.post("/login", login);
router.post("/register", register);
router.get("/check-auth", auth, checkAuth);

module.exports = router;
