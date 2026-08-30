import { Router } from "express"
import { obtenerVehiculos, obtenerVehiculoPorId, crearVehiculo, editarVehiculo, eliminarVehiculos } from "../controllers/vehiculos.controller"

export const router = Router();

router.get("/vehiculos", obtenerVehiculos);
router.get("/vehiculos/:id", obtenerVehiculoPorId);
router.post("/vehiculos", crearVehiculo);
router.put("/vehiculos/:id", editarVehiculo);
router.delete("/vehiculos/:id", eliminarVehiculos);

export default router;