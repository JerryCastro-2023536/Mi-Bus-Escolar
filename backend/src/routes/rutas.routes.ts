import { Router } from "express"
import { listarRuta, obtenerRutaPorId, agregarRutas, editarRuta, eliminarRutaPorId } from "../controllers/rutas.controller"

export const router = Router();

router.get("/listarRutas", listarRuta);
router.get("/listarRutaPorId", obtenerRutaPorId);
router.post("/agregarRuta", agregarRutas);
router.put("/editarRuta", editarRuta);
router.delete("/eliminarRuta", eliminarRutaPorId);