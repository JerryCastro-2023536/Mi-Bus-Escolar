import { Router } from "express";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createEstudianteSchema } from "../validators/estudiantes.validator";
import {
    deleteEstudiante,
    getEstudianteById,
    getEstudiantes,
    postEstudiantes,
    putEstudiante
} from "../controllers/estudiantes.controller";

const router = Router();

router.get("/estudiantes", getEstudiantes);
router.get("/estudiantes/:id", getEstudianteById);
router.post("/estudiantes", validateSchema(createEstudianteSchema), postEstudiantes);
router.put("/estudiantes/:id", validateSchema(createEstudianteSchema), putEstudiante);
router.delete("/estudiantes/:id", deleteEstudiante);

export default router;