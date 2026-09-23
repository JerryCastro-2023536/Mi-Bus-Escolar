import { Router } from "express";
import { deleteParada, getParadaById, getParadas, postParadas, putParada } from "../controllers/paradas.controller";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createParadaSchema, updateParadaSchema } from "../validators/paradas.validator";

const router = Router();

router.get("/paradas", getParadas);
router.post("/paradas",validateSchema(createParadaSchema), postParadas);
router.get("/paradas/:id", getParadaById);
router.put("/paradas/:id",validateSchema(updateParadaSchema), putParada);
router.delete("/paradas/:id", deleteParada);

export default router;