import { Router } from "express"
import { listarVehiculos, obtenerVehiculoPorId, crearVehiculo, editarVehiculo, eliminarVehiculo } from "../controllers/vehiculos.controller"

export const router = Router();

router.get("/listarVehiculos", listarVehiculos);
router.get("/listarVehiculoPorId", obtenerVehiculoPorId);
router.post("/agregarVehiculo", crearVehiculo);
router.put("/editarVehiculo", editarVehiculo);
router.delete("/eliminarVehiculo", eliminarVehiculo);