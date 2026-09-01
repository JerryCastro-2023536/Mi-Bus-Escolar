import express from "express";
import cors from "cors";
import apiRouter from "./routes/ApiRouter";
import { pruebaConexion } from "./config/conexion";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json())
app.use('/api', apiRouter);

app.listen(port, () =>{
    pruebaConexion();
    console.log(`Servidor corriendo en http://localhost:${port}`);
});