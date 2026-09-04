import { Router } from "express"
import {obtenerProveedores, obtenerProveedorPorId, crearProveedor, editarProveedor, eliminarProveedores} from "../controllers/proveedores.controller"
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createProveedorSchema, updateProveedorSchema } from "../validators/proveedores.validator";
const router = Router();

router.get("/proveedores", obtenerProveedores);
router.get("/proveedores/:id", obtenerProveedorPorId);
router.post("/proveedores", validateSchema(createProveedorSchema) ,crearProveedor);
router.put("/proveedores/:id", validateSchema(updateProveedorSchema) ,editarProveedor);
router.delete("/proveedores/:id", eliminarProveedores);

export default router;