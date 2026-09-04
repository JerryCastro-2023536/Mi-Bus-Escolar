import { Router } from "express";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createChoferSchema } from "../validators/choferes.validator";

import {
    deleteChofer,
    getChoferById,
    getChoferes,
    postChoferes,
    putChofer
} from "../controllers/choferes.controller";

const router = Router();

router.get("/choferes", getChoferes);
router.get("/choferes/:id", getChoferById);
router.post("/choferes", validateSchema(createChoferSchema), postChoferes);
router.put("/choferes/:id", validateSchema(createChoferSchema), putChofer);
router.delete("/choferes/:id", deleteChofer);

export default router;