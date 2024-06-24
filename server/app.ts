import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import { userHTTPRouter } from './api/routes/user.routes';
import { roomHTTPRouter } from './api/routes/room.routes';
// import { annotationHTTPRouter } from './routes/annotation.routes';
import { AppDataSource } from './data-source';

require('reflect-metadata');

require("dotenv").config();
var config = require('./config/environment');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
	origin: config.app_url,
	optionsSuccessStatus: 200
}));

const socketApi = require('./sockets');
const verifyUserIP = require('./middleware/verifyUserIP');
const { authenticateToken } = require('./middleware/authenticateToken');

app.use('/api/auth', userHTTPRouter);
app.use("/api/collaboration", authenticateToken, roomHTTPRouter);
// app.use("/api", annotationHTTPRouter);

// Set up a simple GET route
app.get('/', (req, res) => {
	res.send('Server is running!'); // Send back a response indicating the server is up
});

const server = http.createServer(app);
const io = new Server(server, {
    serveClient: config.env === 'production' ? false : true,
    path: '/socket.io',
    cors: {
        origin: config.app_url,
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.use(verifyUserIP);
socketApi(io);

// Start server
server.listen(config.port, config.ip, function () {
	console.log('Socket.io Server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;