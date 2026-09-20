import { Router } from "express";
import { deletePago, getDetallePago, getEstudiantesPorServicio, getEstudiantesPorTutor, getMesesEstudianteProveedor, getMesesPendientes, getPagoById, getPagos, getServiciosProveedor, postPagos, postRegistrarPago, putPago } from "../controllers/pagos.controller";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createPagoSchema, registrarPagoSchema, updatePagoSchema } from "../validators/pagos.validator";


const router = Router();

router.get("/pagos", getPagos);
router.get("/pagos/:id", getPagoById);
router.post("/pagos", validateSchema(createPagoSchema), postPagos);
router.put("/pagos/:id", validateSchema(updatePagoSchema), putPago);
router.delete("/pagos/:id", deletePago);

router.get("/pagos/estudiantes/:idUsuario", getEstudiantesPorTutor);
router.get("/pagos/meses/:idEstudiante", getMesesPendientes);
router.get("/pagos/detalle/:idEstudiante/:idServicio/:mes/:anio", getDetallePago);
router.post("/pagos/registrar", validateSchema(registrarPagoSchema), postRegistrarPago);

router.get("/pagos/proveedor/servicios/:idUsuario", getServiciosProveedor);
router.get("/pagos/proveedor/servicios/:idUsuario/:idServicio/estudiantes", getEstudiantesPorServicio);
router.get("/pagos/proveedor/servicios/:idUsuario/:idServicio/estudiantes/:idEstudiante/meses", getMesesEstudianteProveedor);

export default router;
