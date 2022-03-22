// import required models
const { Product } = require("../../models");

// get all products
exports.getProducts = (req, res) => {
  try {
    Product.findAll({
      attributes: ["id", "title", "price", "image"],
    }).then((products) => {
      products = JSON.parse(JSON.stringify(products));
      products = products.map((product) => {
        return {
          ...product,
          image: process.env.FILE_PATH + product.image,
        };
      });
      res.send({
        status: "success",
        data: { products },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// get product by id
exports.getProductById = (req, res) => {
  try {
    Product.findByPk(req.params.id, {
      attributes: ["id", "title", "price", "image"],
    }).then((product) => {
      if (!product) {
        res.status(404).send({
          status: "error",
          message: "Product not found",
        });
        return;
      }
      product = JSON.parse(JSON.stringify(product));
      res.send({
        status: "success",
        data: { ...product, image: process.env.FILE_PATH + product.image },
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// add product
exports.addProduct = (req, res) => {
  try {
    Product.create({
      title: req.body.title,
      price: req.body.price,
      image: req.file.filename,
    }).then((product) => {
      res.send({
        status: "success",
        data: { product },
      });
    });
  } catch (error) {
    if (error instanceof TypeError)
      return res.status(400).send({
        status: "error",
        message: "Please select a file to upload!",
      });
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// update product
exports.updateProduct = (req, res) => {
  try {
    let filename = null;
    try {
      filename = req.file.filename;
    } catch (e) {
      filename = req.body.image;
    }
    Product.update(
      {
        title: req.body.title,
        price: req.body.price,
        image: filename,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then((product) => {
      if (!product) {
        res.status(404).send({
          status: "error",
          message: "Product not found",
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

// delete product
exports.deleteProduct = (req, res) => {
  try {
    Product.destroy({
      where: {
        id: req.params.id,
      },
    }).then((product) => {
      if (!product) {
        res.status(404).send({
          status: "error",
          message: "Product not found",
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
