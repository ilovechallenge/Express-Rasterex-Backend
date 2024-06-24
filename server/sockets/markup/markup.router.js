const markupController = require('./markup.controller');

module.exports = (socket) => {
    // Listen for rate event from this socket
    socket.on('markup:GuiMarkup', ({ roomId, data, userId }) => {
        // const otherSockets = roomInfo[0].sockets.filter(socket_id => socket_id !== socket.id);
        markupController.handleGuiMarkup(socket, roomId, data, userId);
    });
};
