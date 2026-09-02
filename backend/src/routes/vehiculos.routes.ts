import { Router } from "express"
import { obtenerVehiculos, obtenerVehiculoPorId, crearVehiculo, editarVehiculo, eliminarVehiculos } from "../controllers/vehiculos.controller"
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createVehiculoSchema, updateVehiculoSchema } from "../validators/vehiculos.validator";
export const router = Router();

router.get("/vehiculos", obtenerVehiculos);
router.get("/vehiculos/:id", obtenerVehiculoPorId);
router.post("/vehiculos", validateSchema(createVehiculoSchema),crearVehiculo);
router.put("/vehiculos/:id", validateSchema(updateVehiculoSchema),editarVehiculo);
router.delete("/vehiculos/:id", eliminarVehiculos);

export default router;