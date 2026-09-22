import { Router } from "express";
import {
  getVehiculosPorChofer,
  getEstudiantesPorChofer,
  getReportesPorChofer,
  getRutasPorChofer
} from "../controllers/choferDashboard.controller";

const router = Router();

router.get("/chofer-dashboard/:id/vehiculos", getVehiculosPorChofer);
router.get("/chofer-dashboard/:id/estudiantes", getEstudiantesPorChofer);
router.get("/chofer-dashboard/:id/reportes", getReportesPorChofer);
router.get("/chofer-dashboard/:id/rutas", getRutasPorChofer);

export default router;
