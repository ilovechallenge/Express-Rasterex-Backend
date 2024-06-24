const roomController = require('./room.controller');

module.exports = (socket) => {
    // Listen for rate event from this socket
    socket.on('room:create', (data) => {
        roomController.createRoom(socket, data);
    });

    socket.on('room:join', (data) => {
        roomController.joinRoom(socket, data);
    });

    socket.on('room:getByFile', (data) => {
        roomController.getRoomsByFile(socket, data);
    });
};
