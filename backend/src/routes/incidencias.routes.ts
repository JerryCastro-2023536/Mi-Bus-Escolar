import { Router } from "express"
import { obtenerIncidencias, obtenerIncidenciaPorId, AgregarIncidencia, editarIncidencia, eliminarIncidenciaPorId } from "../controllers/incidencias.controller"

export const router = Router();

router.get("/listarIncidencias", obtenerIncidencias);
router.get("/listarIncidenciaPorId", obtenerIncidenciaPorId);
router.post("/agregarIncidencia", AgregarIncidencia);
router.put("/editarIncidencia", editarIncidencia);
router.delete("/eliminarIncidencia", eliminarIncidenciaPorId);