import { AppDataSource } from "../../data-source";
import { Annotation } from "../../entity/Annotation.entity";
import { Room } from "../../entity/Room.entity";

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

export class MarkupHTTPController {
    static async createMarkup(roomId, data, userId) { 
        const uuid = uuidv4();
        const markupRepository = AppDataSource.getRepository(Annotation);
        const roomRepository = AppDataSource.getRepository(Room);

        const room = await roomRepository.findOneBy({
            id: roomId
        })
        console.log("markup room: ", room)

        const markup = markupRepository.create({
            id: uuid,
            comment: data,
            user: userId,
            room: room
        })
        const result = await markupRepository.save(markup);
        console.log('Markup Saver', result)
    }

    static async getMarkups(userId, roomId, status) { 
        try {
            console.log("get markups userId", userId)
            const markupRepository = AppDataSource.getRepository(Annotation);
            const roomRepository = AppDataSource.getRepository(Room);
            const room = await roomRepository.findOneBy({
                id: roomId,
            })
            console.log('room:', room)
            if (room) {
                const markups = await markupRepository
                    .createQueryBuilder("markup")
                    // .where("markup.user != :userId", { userId: userId }) 
                    .where("markup.roomId = :roomId", {roomId: room.id})
                    .getMany();
                return {markups: markups, sockets: room.users_socket};
            }
        } catch (error) {
            console.log("Internal Server error: getMarkups", error);
            
        }
    }

    static async deleteMarkupsByRoom(room) {
        await AppDataSource
            .createQueryBuilder("markup")
            .delete()
            .from(Annotation)
            .where("room = :room", { room: room })
            .execute()
    }

    static async deleteAllMarkups() {
        await AppDataSource
            .createQueryBuilder()
            .delete()
            .from(Annotation)
            .execute()
    }
}