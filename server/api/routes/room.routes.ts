import { RoomHTTPController } from "../controllers/room.controller";

const express = require('express');
const Router = express.Router();

Router.get(
    "/get-rooms/:file",
    RoomHTTPController.getRoomsByFile
);

Router.get(
    "/save-room/:roomId",
    RoomHTTPController.saveRoom
);

export { Router as roomHTTPRouter };