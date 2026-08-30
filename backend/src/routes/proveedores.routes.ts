import { Router } from "express"
import {listarProveedor, obtenerProveedorPorId, agregarProveedores, editarProveedor, eliminarProveedorPorId} from "../controllers/proveedores.controller"

export const router = Router();

router.get("/listarProveedores", listarProveedor);
router.get("/listarProveedorPorId", obtenerProveedorPorId);
router.post("/agregarProveedor", agregarProveedores);
router.put("/editarProveedor", editarProveedor);
router.delete("/eliminarProveedor", eliminarProveedorPorId);