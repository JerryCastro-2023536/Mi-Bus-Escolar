import  dotenv  from 'dotenv';
import cors from 'cors';
import { pruebaConexion } from "./config/conexion";
import express from 'express';
import apiRouter from './routes/apiRouter';

dotenv.config();
const app = express();
const PORT = process.env.APP_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
pruebaConexion();

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`SERVIDOR EJECUTANDOSE EN PUERTO: ${PORT}` )
});