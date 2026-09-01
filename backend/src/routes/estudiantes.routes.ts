import { Router } from "express";
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
router.post("/estudiantes", postEstudiantes);
router.put("/estudiantes/:id", putEstudiante);
router.delete("/estudiantes/:id", deleteEstudiante);

export default router;