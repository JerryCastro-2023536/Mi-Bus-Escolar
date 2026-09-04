import { Router } from "express";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createColegioSchema } from "../validators/colegios.validator";
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
router.post("/colegios", validateSchema(createColegioSchema), postColegios);
router.put("/colegios/:id", validateSchema(createColegioSchema), putColegio);
router.delete("/colegios/:id", deleteColegio);

export default router;