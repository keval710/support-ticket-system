import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import "./db/connection";
import { errorConverter, errorHandler } from "./middleware/error";
import routes from './routes';
import config from "./config/config";
import { initializeSocket } from "./socket/socket";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

const corsOpts = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: [
        'GET',
        'POST',
        'PATCH',
        'PUT',
        'DELETE',
    ],
    allowedHeaders: [
        '*',
    ],
    credentials: true
};

app.use(cors(corsOpts));

// Make io accessible to routes
app.set('io', io);

app.use('/api', routes);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

httpServer.listen(config.port, () => console.log(`server started on port ${config.port}`));