import { Request, Response } from "express";
import { Room } from "../../entity/Room.entity";
import { AppDataSource } from "../../data-source";
import { MarkupHTTPController } from "./markup.controller";
import { User } from "../../entity/User.entity";

const { v4: uuidv4 } = require('uuid');

export class RoomHTTPController {
    static async getRooms(req: Request, res: Response) {
        const roomRepository = AppDataSource.getRepository(Room);
        const rooms = await roomRepository.find();
        return res.status(200).json({
            data: rooms,
        });
    }

    static async getRoomsByFile(req: Request, res: Response) {
        try {
            const roomRepository = AppDataSource.getRepository(Room);
            const userRepository = AppDataSource.getRepository(User);
            const file = req.params.file;
            const rooms = await roomRepository.findBy({
                file: file
            });
            const promises = rooms.map(async (room) => {
                const user = await userRepository.findOneBy({
                    id: room.creator,
                });
                room['userName'] = user.name;
                return room;
            });
            const updatedRooms = await Promise.all(promises);
            return res.status(200).json({
                data: updatedRooms,
            });
        } catch (error) {
            console.log("Internal Server error: gettingRooms")
        }
    }

    static async createRoom(item, userId, roomName, socket) {
        try {
            console.log('create room', item, "roomName", roomName, userId, socket)
            const uuid = uuidv4();
            const roomRepository = AppDataSource.getRepository(Room);
            const room = roomRepository.create({
                id: uuid,
                name: roomName,
                creator: userId,
                creator_socket: socket.id,
                file: item.id,
                status: true,
                users: [],
                users_socket: [],
            });
            const result = await roomRepository.save(room);
            if (result) return {roomId: result.id, sockets: result.users_socket};
            console.log("Create Room Controller: ", result)
        } catch (error) {
            console.log("Server error: createRoom: ", error)
        }
    }

    static async updateRoom(req: Request, res: Response) {
        const roomRepository = AppDataSource.getRepository(Room);
        let room = await roomRepository.findOneBy({
            file: req.body.file,
        });
        console.log("Update room with file: ", room)
        if (room) {
            room = roomRepository.merge(room, {status: req.body.status});
            const result = await roomRepository.save(room);
            console.log("Update room: ", result)
            return res.status(200).json({ data: result });
        } else {
            return res.status(404).json({ message: "Room not found" })
        }
    }

    static async updateRoomSocket(roomId, userId, socketId) {
        const roomRepository = AppDataSource.getRepository(Room);
        let room = await roomRepository.findOneBy({
            id: roomId,
        });
        console.log("updateRoom's room: ", room)
        if (room) {
            room.users.push(userId);
            room.users_socket.push(socketId);
            const result = await roomRepository.save(room);
            return result.name;
            console.log("Update room Socket: ", result)
        } else {
            console.log("no update room");
        }
    }

    static async removeUserOnRoom(roomId, socketId, isCreator) {
        const roomRepository = AppDataSource.getRepository(Room);
        let room = await roomRepository.findOneBy({
            id: roomId,
        });
        if (room) {
            if (isCreator) {
                const result = await roomRepository.delete(roomId);
                console.log("Remove User On Room: ", result);
                return;
            } else {
                room.users_socket = room.users_socket.filter(user_socket => user_socket !== socketId );
                const result = await roomRepository.save(room);
                console.log("Update room For remove user: ", result)
            }
        }
    }

    static async deleteRoom(req: Request, res: Response) {
        const roomRepository = AppDataSource.getRepository(Room);
        const result = await roomRepository.delete(req.params.id);
        console.log("Delete Room: ", result)
        if (result.affected === 0) {
            return res.status(404).json({message: "Room not found"})
        } else {
            return res.status(204).send()
        }
    }

    static async deleteRoomSocket(roomId) {
        const roomRepository = AppDataSource.getRepository(Room);
        let room = await roomRepository.findOneBy({
            id: roomId,
        });
        if (room.status) {
            const result = await roomRepository.delete(roomId);
            console.log("Deleted Room: ", result)
        }
    }

    static async handleSocketDisconnection(socketId: string) {
        try {
            const roomRepository = AppDataSource.getRepository(Room);
            const roomAsCreator = await roomRepository.findOneBy({
                creator_socket: socketId
            });
            console.log("handleSocketdisconnection", roomAsCreator)
            // await MarkupHTTPController.deleteAllMarkups();
            if (roomAsCreator) {
                await MarkupHTTPController.deleteMarkupsByRoom(roomAsCreator);
                await roomRepository.remove(roomAsCreator);
            } else {
                const roomWithSocketInUsers = await roomRepository
                    .createQueryBuilder("room")
                    .where(":socketId = ANY(room.users_socket)", { socketId })
                    .getOne();
                if (roomWithSocketInUsers) {
                    roomWithSocketInUsers.users_socket = roomWithSocketInUsers.users_socket.filter(id => id !== socketId);
                    await roomRepository.save(roomWithSocketInUsers);
                }
            }
        } catch (error) {
            console.log("Internal Server error: handleSocketDisconnection", error);
        }
    }

    static async saveRoom(req: Request, res: Response) {
        try {
            const roomRepository = AppDataSource.getRepository(Room);
            const room = await roomRepository.findOneBy({
                id: req.params.roomId
            });
            if (room) {
                console.log("saveRoom: roomInstance", room);
                room.status = false;
            }
            const result = await roomRepository.save(room);
            console.log("saveRoom: ", result);
            return res.status(200).json({ data: result });
        } catch (error) {
            console.log("Internal Server error: saveRoom", error);
        }
    }

    static async getSocketsFromRoom(roomId) {
        try {
            const roomRepository = AppDataSource.getRepository(Room);
            const room = await roomRepository.findOneBy({
                id: roomId
            });
            if (room) {
                console.log("saveRoom: roomInstance", room);
                return [...room.users_socket, room.creator_socket]
            }
        } catch (error) {
            console.log("Internal Server error: saveRoom", error);
        }
    }

    static async deleteAllRooms() {
        await AppDataSource
            .createQueryBuilder()
            .delete()
            .from(Room)
            .execute()
    }
}
