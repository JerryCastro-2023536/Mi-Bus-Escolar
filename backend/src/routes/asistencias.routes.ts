import { Router } from "express";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createAsistenciaSchema } from "../validators/asistencias.validator";

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
router.post("/asistencias", validateSchema(createAsistenciaSchema), postAsistencias);

router.put("/asistencias/:id", validateSchema(createAsistenciaSchema), putAsistencia);
router.delete("/asistencias/:id", deleteAsistencia);

export default router;