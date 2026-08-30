import { Router } from "express"
import { obtenerRutas, obtenerRutaPorId, crearRuta, editarRuta, eliminarRutas } from "../controllers/rutas.controller"

const router = Router();

router.get("/rutas", obtenerRutas);
router.get("/rutas/:id", obtenerRutaPorId);
router.post("/rutas", crearRuta);
router.put("/rutas/:id", editarRuta);
router.delete("/rutas/:id", eliminarRutas);

export default router;