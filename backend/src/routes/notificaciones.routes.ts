import { Router } from "express";
import { deleteNotificacion, getNotificacionById, getNotificaciones, postNotificaciones, putNotificacion } from "../controllers/notificaciones.controller";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createNotificacionSchema, updateNotificacionSchema } from "../validators/notificaciones.validator";

const router = Router();

router.get("/notificaciones", getNotificaciones);
router.get("/notificaciones/:id", getNotificacionById);
router.post("/notificaciones", validateSchema(createNotificacionSchema), postNotificaciones);
router.put("/notificaciones/:id", validateSchema(updateNotificacionSchema), putNotificacion);
router.delete("/notificaciones/:id", deleteNotificacion);

export default router;