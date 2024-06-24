const roomsModel = require('./room.model');
const socketsModel = require('../socket/socket.model');
const socketController = require('../socket/socket.controller');
const { isEmpty } = require('../../utils/util');
const { RoomHTTPController } = require('../../api/controllers/room.controller');
const { MarkupHTTPController } = require('../../api/controllers/markup.controller');
// const { v4: uuidv4 } = require('uuid');

const createRoom = async (socket, data) => {
    console.log("data", data)
    const {item, userId, roomName} = data;
    let result = await RoomHTTPController.createRoom(item, userId, roomName, socket)
    const {roomId, sockets} = result;
    let allSockets = [...sockets, socket.id]
    socketController.broadcast('room:update', [socket.id], {roomId: roomId, roomName: roomName, data: null});
};

const joinRoom = async (socket, data) => {
    // MarkupHTTPController.deleteAllMarkups()
    console.log("join room: ", data)
    const {roomId, userId, status} = data;

    console.log("join room: roomId, userId, status", roomId, userId, status)

    let allSockets = [socket.id]

    let roomName = await RoomHTTPController.updateRoomSocket(roomId, userId, socket.id);

    MarkupHTTPController.getMarkups(userId, roomId, status).then(data => {
        const {markups, sockets} = data;
        markups.map((element, index) => {
            socketController.broadcast('markup:GuiMarkupChanged', [socket.id], { roomId: roomId, data: element.comment });
        })
    })

    console.log("join room roomName: ", roomName, allSockets)

    socketController.broadcast('room:update', allSockets, {roomId: roomId, roomName: roomName, data: null});
};

const getRoomsByFile = (socket, file) => {
    // const filteredRoomsByFileId = Object.values(roomsModel).filter(room => room.file.id === file.id);

    // socket.emit("room:update", filteredRoomsByFileId);
};

const removeSocketFromRooms = (socket) => {
    // Object.entries(roomsModel).forEach(([fileId, rooms]) => {
    //     rooms.forEach((room, roomIndex) => {
    //         const socketIndex = room.sockets.indexOf(socket.id);
    //         if (socketIndex !== -1) {
    //             room.sockets.splice(socketIndex, 1);
    
    //             if (room.sockets.length === 0) {
    //                 rooms.splice(roomIndex, 1);
    //             }
    //         }
    //     });
    //     if (rooms.length === 0) {
    //         delete roomsModel[fileId];
    //     }
    // });
    RoomHTTPController.handleSocketDisconnection(socket.id);
};

module.exports = {
    createRoom,
    joinRoom,
    getRoomsByFile,
    removeSocketFromRooms
};
