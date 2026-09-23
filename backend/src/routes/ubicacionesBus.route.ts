import { Router } from "express";
import { getUbicacionesBus, getUbicacionBusById, postUbicacionBus, putUbicacionBusByID, deleteUbicacionBusById } from "../controllers/ubicacionesBus.controller";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createUbicacionSchema, updateUbicacionSchema } from "../validators/ubicacionesBus.validator";

const router = Router();

router.get("/ubicaciones-bus", getUbicacionesBus);
router.get("/ubicaciones-bus/:id", getUbicacionBusById);
router.post("/ubicaciones-bus", validateSchema(createUbicacionSchema), postUbicacionBus);
router.put("/ubicaciones-bus/:id", validateSchema(updateUbicacionSchema), putUbicacionBusByID);
router.delete("/ubicaciones-bus/:id", deleteUbicacionBusById);

export default router;