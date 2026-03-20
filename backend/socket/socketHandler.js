const socketHandler = (io) => {
  io.on('connection', (socket) => {
    // Join a product room to receive live bid updates
    socket.on('joinProduct', (productId) => {
      socket.join(productId);
    });

    socket.on('leaveProduct', (productId) => {
      socket.leave(productId);
    });

    // Join personal room for notifications
    socket.on('joinUser', (userId) => {
      socket.join(userId);
    });

    socket.on('disconnect', () => {});
  });
};

module.exports = socketHandler;
