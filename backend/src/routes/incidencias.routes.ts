import { Router } from "express"
import { obtenerIncidencias, obtenerIncidenciaPorId, crearIncidencia, editarIncidencia, eliminarIncidencias } from "../controllers/incidencias.controller"
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createIncidenciaSchema, updateIncidenciaSchema } from "../validators/incidencias.validator";
const router = Router();

router.get("/incidencias", obtenerIncidencias);
router.get("/incidencia/:id", obtenerIncidenciaPorId);
router.post("/incidencias", validateSchema(createIncidenciaSchema), crearIncidencia);
router.put("/incidencias/:id",validateSchema(updateIncidenciaSchema) ,editarIncidencia);
router.delete("/incidencias/:id", eliminarIncidencias);

export default router;