import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import { pruebaConexion } from "./config/conexion";
import express from 'express';
import apiRouter from './routes/apiRouter';
import { errorHandler } from './errors/errorHandler';
import { notFoundHandler } from './utils/middleware/notFound.middleware';
import { JsonSyntaxError, validateEmptyBody } from './utils/middleware/jsonValid.middleware';

dotenv.config();
const app = express();
const PORT = process.env.APP_PORT;

const corsOptions: CorsOptions = {
    origin: process.env.ANGULAR_PORT,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(JsonSyntaxError);
app.use(validateEmptyBody);
app.use(express.urlencoded({ extended: true }));
pruebaConexion();
app.use('/api', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`SERVIDOR EJECUTANDOSE EN PUERTO: ${PORT}`)
});