import { Router } from "express";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createEstudianteSchema } from "../validators/estudiantes.validator";
import {
    deleteEstudiante,
    getEstudianteById,
    getEstudiantes,
    postEstudiantes,
    putEstudiante,
    getEstudiantesPorTutor
} from "../controllers/estudiantes.controller";

const router = Router();

router.get("/estudiantes", getEstudiantes);
router.get("/estudiantes/:id", getEstudianteById);
router.post("/estudiantes", validateSchema(createEstudianteSchema), postEstudiantes);
router.put("/estudiantes/:id", validateSchema(createEstudianteSchema), putEstudiante);
router.delete("/estudiantes/:id", deleteEstudiante);
router.get("/estudiantes/tutor/:idUsuario", getEstudiantesPorTutor);

export default router;