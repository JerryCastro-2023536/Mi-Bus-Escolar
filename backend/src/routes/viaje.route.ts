import { Router } from "express";
import { getViajesActivosPorEstudiante, getViajes, getViajeById, postViaje, putViajeByID, deleteViajeById } from "../controllers/viajes.controller";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createViajeSchema, updateViajeSchema } from "../validators/viajes.validator";

const router = Router();

router.get("/viajes", getViajes);
router.get("/viajes/:id", getViajeById);
router.post("/viajes", validateSchema(createViajeSchema), postViaje);
router.put("/viajes/:id", validateSchema(updateViajeSchema),putViajeByID);
router.delete("/viajes/:id", deleteViajeById);
router.get("/viajes/estudiante/:idEstudiante", getViajesActivosPorEstudiante);

export default router;