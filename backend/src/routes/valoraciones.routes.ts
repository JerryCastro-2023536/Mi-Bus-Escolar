import { Router } from "express";
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
router.post("/valoraciones", postValoraciones);
router.put("/valoraciones/:id", putValoracion);
router.delete("/valoraciones/:id", deleteValoracion);

export default router;