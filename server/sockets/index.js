const socketRouter = require('./socket/socket.router');
const socketController = require('./socket/socket.controller');
const roomRouter = require('./room/room.router');
const roomController = require('./room/room.controller');
const markupRouter = require('./markup/markup.router');

module.exports = (io) => {
    io.on('connection', (socket) => {
        // Register the new socket connection
        socketController.handleRegister(io, socket);
        
        // Initialize the router for this socket
        socketRouter(socket);
        roomRouter(socket);
        markupRouter(socket);

        socket.on('disconnect', () => {
            socketController.handleUnRegister(socket);
            roomController.removeSocketFromRooms(socket);
            console.log(`Client disconnected: ${socket.id}`);
        });

        socket.on('error', (error) => {
            console.error(`Socket error: ${error.message}`);
        });
    });

    io.on('error', (error) => {
        console.error(`io error: ${error.message}`);
    });
};
