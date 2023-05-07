
exports.init = function(io) {
  io.sockets.on('connection', function (socket) {
    console.log("try");
    try {
      /**
       * create or joins a room
       */
      socket.on('create or join', function (room) {
        socket.join(room);
        // Retrieve past messages
        io.sockets.to(room).emit('joined', room);
      });

      socket.on('chat', function (room, userId, chatText) {
        // Send message to database
        io.sockets.to(room).emit('chat', room, userId, chatText);
      });

      socket.on('disconnect', function(){
        console.log('someone disconnected');
      });
    } catch (e) {
    }
  });
}
