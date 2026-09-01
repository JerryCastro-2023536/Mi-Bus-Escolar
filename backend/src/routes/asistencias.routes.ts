import { Router } from "express";
import {
    deleteAsistencia,
    getAsistenciaById,
    getAsistencias,
    postAsistencias,
    putAsistencia
} from "../controllers/asistencias.controller";

const router = Router();

router.get("/asistencias", getAsistencias);
router.get("/asistencias/:id", getAsistenciaById);
router.post("/asistencias", postAsistencias);
router.put("/asistencias/:id", putAsistencia);
router.delete("/asistencias/:id", deleteAsistencia);

export default router;