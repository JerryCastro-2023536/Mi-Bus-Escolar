import {Router} from "express"
import { obtenerServicios, obtenerServicioPorId, crearServicio, editarServicio, eliminarServicios, getMisServicios, postMiServicio, putMiServicio, deleteMiServicio } from "../controllers/servicios.controller"
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createServicioSchema, updateServicioSchema } from "../validators/servicios.validator";
export const router = Router();

router.get("/servicios", obtenerServicios);
router.get("/servicios/:id", obtenerServicioPorId);
router.post("/servicios", validateSchema(createServicioSchema),crearServicio);
router.put("/servicios/:id", validateSchema(updateServicioSchema),editarServicio);
router.delete("/servicios/:id", eliminarServicios);

router.get("/servicios/proveedor/:idUsuario", getMisServicios);
router.post("/servicios/proveedor/:idUsuario", postMiServicio);
router.put("/servicios/proveedor/:idUsuario/:idServicio", putMiServicio);
router.delete("/servicios/proveedor/:idUsuario/:idServicio", deleteMiServicio);

export default router;