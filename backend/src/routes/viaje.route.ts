import { Router } from "express";
import { getViajes, getViajeById, postViaje, putViajeByID, deleteViajeById } from "../controllers/viajes.controller";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createViajeSchema, updateViajeSchema } from "../validators/viajes.validator";

const router = Router();

router.get("/viajes", getViajes);
router.get("/viajes/:id", getViajeById);
router.post("/viajes", validateSchema(createViajeSchema), postViaje);
router.put("/viajes/:id", validateSchema(updateViajeSchema),putViajeByID);
router.delete("/viajes/:id", deleteViajeById);

export default router;