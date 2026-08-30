import { Router } from "express";
import { getViajes, getViajeById, postViaje, putViajeByID, deleteViajeById } from "../controllers/viajes.controller";

const router = Router();

router.get("/viajes", getViajes);
router.get("/viajes/:id", getViajeById);
router.post("/viajes", postViaje);
router.put("/viajes/:id", putViajeByID);
router.delete("/viajes/:id", deleteViajeById);

export default router;