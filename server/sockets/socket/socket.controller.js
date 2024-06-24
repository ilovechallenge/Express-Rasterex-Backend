const socketsModel = require('./socket.model');

const handleRegister = (io, socket) => {
    // Add the socket to the sockets model
    socketsModel[socket.id] = socket;
    socketsModel['io'] = io;
    console.log('Registering socket', Object.keys(socketsModel).length, socket.id);
};

const handleUnRegister = (socket) => {
    //if (socket.id in socketsModel) {
    //    delete socketsModel[socket.id];
    //    console.log('Successfully unregistered.', socket.id);
    //} else {
    //    console.log('Socket ID not found in model.');
    //}
};

const broadcast = (name = "broadcast", socketIds, payload) => {
    socketIds.forEach(socket_id => {
        //socketsModel['io'].to(socket_id).emit(name, payload);
        //const socket = socketsModel['io'].sockets.connected[socket_id];
        //const socket = socketsModel[socket_id];
        if (socketsModel['io']) {
             //socket.emit(name, payload);
             console.log("socket_id, socketsModel", socket_id, socketsModel)
             socketsModel['io'].to(socket_id).emit(name, payload);
        } else {
            console.error(`broadcast: Socket with ID ${socket_id} does not exist.`);
        }
    });
};

const handlePing = (socket, data) => {
    console.log("handlePing", socket.id, data);
}

module.exports = {
    handleRegister,
    broadcast,
    handlePing,
    handleUnRegister
};
