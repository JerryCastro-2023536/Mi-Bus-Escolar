import { Router } from "express"
import {obtenerProveedores, obtenerProveedorPorId, crearProveedor, editarProveedor, eliminarProveedores} from "../controllers/proveedores.controller"

const router = Router();

router.get("/proveedores", obtenerProveedores);
router.get("/proveedor/:id", obtenerProveedorPorId);
router.post("/proveedores", crearProveedor);
router.put("/proveedores/:id", editarProveedor);
router.delete("/proveedores/:id", eliminarProveedores);

export default router;