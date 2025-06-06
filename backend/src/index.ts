import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import "./db/connection";
import { errorConverter, errorHandler } from "./middleware/error";
import routes from './routes';
import config from "./config/config";
import { initializeSocket } from "./socket/socket";
import morgan from "morgan";

const app = express();
const httpServer = createServer(app);

// Log every API request
app.use(morgan('dev'));

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

const corsOpts = {
    origin: '*',
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

// api routes
app.use('/api', routes);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

httpServer.listen(config.port, () => console.log(`server started on port ${config.port}`));