import { Router } from "express"
import { obtenerIncidencias, obtenerIncidenciaPorId, crearIncidencia, editarIncidencia, eliminarIncidencias } from "../controllers/incidencias.controller"

const router = Router();

router.get("/incidencias", obtenerIncidencias);
router.get("/incidencia/:id", obtenerIncidenciaPorId);
router.post("/incidencias", crearIncidencia);
router.put("/incidencias/:id", editarIncidencia);
router.delete("/incidencias/:id", eliminarIncidencias);

export default router;