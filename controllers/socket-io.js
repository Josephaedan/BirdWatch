
exports.init = function(io) {
  io.sockets.on("connection", function (socket) {
    try {
      /**
       * create or joins a room
       */
      socket.on("create or join", function (room) {
        console.log(room);
        console.log("Created/Joined ", room);
        socket.join(room);
        // Retrieve past messages
        io.sockets.to(room).emit("joined", room);
      });

      socket.on("chat", function (room, userId, chatText) {
        console.log(userId, "sent a message to room: ", room);
        io.sockets.to(room).emit("chat", room, userId, chatText);
      });

      socket.on("disconnect", function () {
        console.log("someone disconnected");
      });
    } catch (e) {}
  });
}
