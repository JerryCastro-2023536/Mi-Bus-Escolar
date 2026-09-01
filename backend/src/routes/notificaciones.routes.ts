import { Router } from "express";
import { deleteNotificacion, getNotificacionById, getNotificaciones, postNotificaciones, putNotificacion } from "../controllers/notificaciones.controller";

const router = Router();

router.get("/notificaciones", getNotificaciones);
router.get("/notificaciones/:id", getNotificacionById);
router.post("/notificaciones", postNotificaciones);
router.put("/notificaciones/:id", putNotificacion);
router.delete("/notificaciones/:id", deleteNotificacion);

export default router;