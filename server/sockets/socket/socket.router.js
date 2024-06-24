const socketController = require('./socket.controller');

module.exports = (socket) => {
    // Listen for rate event from this socket
    socket.on('ping:server', (data) => {
        socketController.handlePing(socket, data);
    });
};
