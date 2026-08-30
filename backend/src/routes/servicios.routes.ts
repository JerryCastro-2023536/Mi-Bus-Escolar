import {Router} from "express"
import { listarServicios, obtenerServicioPorId, crearServicio, editarServicio, eliminarServicio } from "../controllers/servicios.controller"

export const router = Router();

router.get("/listarServicios", listarServicios);
router.get("/listarServicioPorId", obtenerServicioPorId);
router.post("/agregarServicio", crearServicio);
router.put("/editarServicio", editarServicio);
router.delete("/eliminarServicio", eliminarServicio);