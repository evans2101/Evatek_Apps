// import required models
const { Chat, User } = require("../../models");

const socketIo = (io) => {
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next();
    } else {
      next(new Error("Authentication error")); 
    }
  });
  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // load contacts
    socket.on("load all contacts", async () => {
      try {
        const contacts = await User.findAll({
          include: [
            {
              model: Chat,
              as: "recipientMessage",
              attributes: ["id", "message", "createdAt"],
            },
            {
              model: Chat,
              as: "senderMessage",
              attributes: ["id", "message", "createdAt"],
            },
          ],
          attributes: ["id", "fullName", "email", "image"],
        });
        contacts.map((contact) => {
          if (contact.image) {
            contact.image = process.env.FILE_PATH + contact.image;
          }
          return contact;
        });
        socket.emit("all contacts", contacts);
      } catch (err) {
        console.log(err);
      }
    });

    // load admin contacts
    socket.on("load admin contacts", async () => {
      try {
        const contacts = await User.findAll({
          include: [
            {
              model: Chat,
              as: "recipientMessage",
              attributes: ["id", "message", "createdAt"],
            },
            {
              model: Chat,
              as: "senderMessage",
              attributes: ["id", "message", "createdAt"],
            },
          ],
          where: {
            isAdmin: 1,
          },
          attributes: ["id", "fullName", "email", "image"],
        });
        contacts.map((contact) => {
          if (contact.image) {
            contact.image = process.env.FILE_PATH + contact.image;
          }
          return contact;
        });
        socket.emit("admin contacts", contacts);
      } catch (err) {
        console.log(err);
      }
    });
  });
};

module.exports = socketIo;
