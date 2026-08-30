import {Router} from "express"
import { obtenerServicios, obtenerServicioPorId, crearServicio, editarServicio, eliminarServicios } from "../controllers/servicios.controller"

export const router = Router();

router.get("/servicios", obtenerServicios);
router.get("/servicios/:id", obtenerServicioPorId);
router.post("/servicios", crearServicio);
router.put("/servicios/:id", editarServicio);
router.delete("/servicios/:id", eliminarServicios);

export default router;