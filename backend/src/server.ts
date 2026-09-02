import  dotenv  from 'dotenv';
import cors from 'cors';
import { pruebaConexion } from "./config/conexion";
import express from 'express';
import apiRouter from './routes/ApiRouter';
import { errorHandler } from './errors/errorHandler';
import { notFoundHandler } from './utils/middleware/notFound.middleware';

dotenv.config();
const app = express();
const PORT = process.env.APP_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
pruebaConexion();
app.use('/api', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`SERVIDOR EJECUTANDOSE EN PUERTO: ${PORT}` )
});