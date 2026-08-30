import { Router } from "express";
import { getUsuarios, getUsuarioById, postUsuario, putUsuarioByID, deleteUsuarioById } from "../controllers/usuario.controller";
const router = Router();

router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuarioById);
router.post("/usuarios", postUsuario);
router.put("/usuarios/:id", putUsuarioByID);
router.delete("/usuarios/:id", deleteUsuarioById);

export default router;