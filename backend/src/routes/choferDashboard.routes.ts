import { Router } from "express";
import {
  getVehiculosPorChofer,
  getEstudiantesPorChofer,
  getReportesPorChofer
} from "../controllers/choferDashboard.controller";

const router = Router();

router.get("/chofer-dashboard/:id/vehiculos", getVehiculosPorChofer);
router.get("/chofer-dashboard/:id/estudiantes", getEstudiantesPorChofer);
router.get("/chofer-dashboard/:id/reportes", getReportesPorChofer);

export default router;
