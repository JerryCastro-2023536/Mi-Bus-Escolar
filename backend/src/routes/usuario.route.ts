import { Router } from "express";
import { getUsuarios, getUsuarioById, postUsuario, putUsuarioByID, deleteUsuarioById } from "../controllers/usuario.controller";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";
const router = Router();

router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuarioById);
router.post("/usuarios", validateSchema(createUserSchema), postUsuario);
router.put("/usuarios/:id", validateSchema(updateUserSchema), putUsuarioByID);
router.delete("/usuarios/:id", deleteUsuarioById);

export default router;