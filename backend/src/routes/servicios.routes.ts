import {Router} from "express"
import { obtenerServicios, obtenerServicioPorId, crearServicio, editarServicio, eliminarServicios } from "../controllers/servicios.controller"
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createServicioSchema, updateServicioSchema } from "../validators/servicios.validator";
export const router = Router();

router.get("/servicios", obtenerServicios);
router.get("/servicios/:id", obtenerServicioPorId);
router.post("/servicios", validateSchema(createServicioSchema),crearServicio);
router.put("/servicios/:id", validateSchema(updateServicioSchema),editarServicio);
router.delete("/servicios/:id", eliminarServicios);

export default router;