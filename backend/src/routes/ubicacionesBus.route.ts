import { Router } from "express";
import { getUbicacionesBus, getUbicacionBusById, postUbicacionBus, putUbicacionBusByID, deleteUbicacionBusById } from "../controllers/ubicacionesBus.controller";

const router = Router();

router.get("/ubicaciones-bus", getUbicacionesBus);
router.get("/ubicaciones-bus/:id", getUbicacionBusById);
router.post("/ubicaciones-bus", postUbicacionBus);
router.put("/ubicaciones-bus/:id", putUbicacionBusByID);
router.delete("/ubicaciones-bus/:id", deleteUbicacionBusById);

export default router;