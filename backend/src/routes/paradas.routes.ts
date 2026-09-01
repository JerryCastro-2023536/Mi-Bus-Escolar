import { Router } from "express";
import { deleteParada, getParadaById, getParadas, postParadas, putParada } from "../controllers/paradas.controller";

const router = Router();

router.get("/paradas", getParadas);
router.post("/paradas", postParadas);
router.get("/paradas/:id", getParadaById);
router.put("/paradas/:id", putParada);
router.delete("/paradas/:id", deleteParada);

export default router;