// import jwt
const jwt = require("jsonwebtoken");

// Auth middleware
exports.auth = async (req, res, next) => {
  try {
    // get token from header
    const token = req.header("Authorization").replace("Bearer ", "");
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // add user from payload
    req.user = decoded;
    // call next middleware
    next();
  } catch (error) {
    res.status(401).send({
      status: "error",
      message: "Please authenticate",
    });
  }
};
