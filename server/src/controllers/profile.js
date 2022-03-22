// import required models
const { Profile } = require("../../models");

// add profile
exports.addProfile = (req, res) => {
  try {
    Profile.create({
      ...req.body,
    }).then((profile) => {
      res.send({
        status: "success",
        data: profile,
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};

// update profile
exports.updateProfile = (req, res) => {
  try {
    Profile.update(
      {
        ...req.body,
      },
      {
        where: {
          userId: req.params.userId,
        },
      }
    ).then((profile) => {
      res.send({
        status: "success",
        data: profile,
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
};
