const socketController = require('../socket/socket.controller');
const { MarkupHTTPController } = require('../../api/controllers/markup.controller');
const { RoomHTTPController } = require('../../api/controllers/room.controller');

const handleGuiMarkup = async (socket, roomId, data, userId) => {
    try {
        let otherSockets = await RoomHTTPController.getSocketsFromRoom(roomId);
        console.log("otherSockets in markup:Guimarkup", otherSockets)
        otherSockets = otherSockets.filter(id => id !== socket.id);
         console.log('markup:GuiMarkup otherSockets::: ', otherSockets);
        socketController.broadcast('markup:GuiMarkupChanged', otherSockets, { data });
        MarkupHTTPController.createMarkup(roomId, data, userId);
    } catch (error) {
        console.log("Internal server error: handleGuiMarkup", error);
    }
}

module.exports = {
    handleGuiMarkup,
};
