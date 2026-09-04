import { Router } from "express";
import { getRutaParadas, getRutaParadaById, postRutaParada, putRutaParadaByID, deleteRutaParadaById } from "../controllers/rutaParada.controller";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createRutaParadaSchema, updateRutaParadaSchema } from "../validators/rutaParada.validator";

const router = Router();

router.get("/ruta-parada", getRutaParadas);
router.get("/ruta-parada/:id", getRutaParadaById);
router.post("/ruta-parada", validateSchema(createRutaParadaSchema),postRutaParada);
router.put("/ruta-parada/:id", validateSchema(updateRutaParadaSchema),putRutaParadaByID);
router.delete("/ruta-parada/:id", deleteRutaParadaById);

export default router;