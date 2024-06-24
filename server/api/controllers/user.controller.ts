import { Request, Response } from "express";
import { User } from "../../entity/User.entity";
import { AppDataSource } from "../../data-source";
import { MarkupHTTPController } from "./markup.controller";
import { RoomHTTPController } from "./room.controller";

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

export class UserController {
    static async createUser(req: Request, res: Response) { 
        console.log("Create USer body request: ", req.body)
        const userRepository = AppDataSource.getRepository(User);
        const uuid = uuidv4();
        const user = userRepository.create({
            id: uuid,
            name: req.body.name,
        })
        const result = await userRepository.save(user);
        return res.status(200).json({
            data: result,
        })
    }

    static async loginUser(req: Request, res: Response) {
        try {
            console.log("Login User Body Request: ", req.body)
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({
                name: req.body.email
            });

            if (!user) {
                return res.status(404).json({
                    data: "Invalid credentials",
                })
            }
            const payload = { id: user.id, name: user.email };
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
            return res.status(200).json({
                data: user,
                accessToken: accessToken
            })
        } catch (error) {
            console.error('Error logging in user:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    static async initializeDB(req: Request, res: Response) {
        await MarkupHTTPController.deleteAllMarkups();
        await RoomHTTPController.deleteAllRooms();
        return res.status(200).json({ message: 'Success initialize' });
    }
}