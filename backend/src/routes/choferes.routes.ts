import { Router } from "express";
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
router.post("/choferes", postChoferes);
router.put("/choferes/:id", putChofer);
router.delete("/choferes/:id", deleteChofer);

export default router;