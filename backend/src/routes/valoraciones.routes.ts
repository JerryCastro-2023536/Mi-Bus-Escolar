import { Router } from "express";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createValoracionSchema } from "../validators/valoraciones.validator";
import {
    deleteValoracion,
    getValoracionById,
    getValoraciones,
    postValoraciones,
    putValoracion
} from "../controllers/valoraciones.controller";

const router = Router();

router.get("/valoraciones", getValoraciones);
router.get("/valoraciones/:id", getValoracionById);
router.post("/valoraciones", validateSchema(createValoracionSchema), postValoraciones);
router.put("/valoraciones/:id", validateSchema(createValoracionSchema), putValoracion);
router.delete("/valoraciones/:id", deleteValoracion);

export default router;