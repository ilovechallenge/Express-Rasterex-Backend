import { UserController } from "../controllers/user.controller";

const express = require('express');
const Router = express.Router();

Router.post(
    '/create-user',
    UserController.createUser
)

Router.post(
    '/login',
    UserController.loginUser
)

Router.post(
    '/initialize',
    UserController.initializeDB
)

export { Router as userHTTPRouter }