import { Router } from "express";
import { getRutaParadas, getRutaParadaById, postRutaParada, putRutaParadaByID, deleteRutaParadaById } from "../controllers/rutaParada.controller";

const router = Router();

router.get("/ruta-parada", getRutaParadas);
router.get("/ruta-parada/:id", getRutaParadaById);
router.post("/ruta-parada", postRutaParada);
router.put("/ruta-parada/:id", putRutaParadaByID);
router.delete("/ruta-parada/:id", deleteRutaParadaById);

export default router;