import { Router } from "express"
import { obtenerRutas, obtenerRutaPorId, crearRuta, editarRuta, eliminarRutas } from "../controllers/rutas.controller"
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createRutaSchema, updateSchema } from "../validators/rutas.validator";
const router = Router();

router.get("/rutas", obtenerRutas);
router.get("/rutas/:id", obtenerRutaPorId);
router.post("/rutas", validateSchema(createRutaSchema),crearRuta);
router.put("/rutas/:id", validateSchema(updateSchema),editarRuta);
router.delete("/rutas/:id", eliminarRutas);

export default router;