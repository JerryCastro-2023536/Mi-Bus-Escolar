import { Router } from "express";
import {
    deleteColegio,
    getColegioById,
    getColegios,
    postColegios,
    putColegio
} from "../controllers/colegios.controller";

const router = Router();

router.get("/colegios", getColegios);
router.get("/colegios/:id", getColegioById);
router.post("/colegios", postColegios);
router.put("/colegios/:id", putColegio);
router.delete("/colegios/:id", deleteColegio);

export default router;