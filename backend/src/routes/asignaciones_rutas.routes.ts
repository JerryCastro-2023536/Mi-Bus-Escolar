import { Router } from "express";
import { deleteAsignacionRuta, getAsignacionesRutas, getAsignacionRutaById, postAsignacionesRutas, putAsignacionRuta } from "../controllers/asignacionesRutas.controller";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createAsignacionRutaSchema, updateAsignacionRutaSchema } from "../validators/asignaciones_rutas.validator";

const router = Router();

router.get("/asignaciones", getAsignacionesRutas);
router.get("/asignaciones/:id", getAsignacionRutaById);
router.post("/asignaciones", validateSchema(createAsignacionRutaSchema), postAsignacionesRutas);
router.put("/asignaciones/:id", validateSchema(updateAsignacionRutaSchema), putAsignacionRuta);
router.delete("/asignaciones/:id", deleteAsignacionRuta);

export default router;