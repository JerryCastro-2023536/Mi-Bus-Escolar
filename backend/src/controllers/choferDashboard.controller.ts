import { Request, Response, NextFunction } from "express";
import {
  obtenerVehiculosPorChofer,
  obtenerEstudiantesPorChofer,
  obtenerReportesPorChofer
} from "../services/choferDashboard.service";

export async function getVehiculosPorChofer(req: Request, res: Response, next: NextFunction) {
  try {
    const idChofer = Number(req.params.id);
    const vehiculos = await obtenerVehiculosPorChofer(idChofer);

    return res.status(200).json({
      success: true,
      message: "Vehículos del chofer cargados",
      data: vehiculos
    });
  } catch (error) {
    next(error);
  }
}

export async function getEstudiantesPorChofer(req: Request, res: Response, next: NextFunction) {
  try {
    const idChofer = Number(req.params.id);
    const estudiantes = await obtenerEstudiantesPorChofer(idChofer);

    return res.status(200).json({
      success: true,
      message: "Estudiantes del chofer cargados",
      data: estudiantes
    });
  } catch (error) {
    next(error);
  }
}

export async function getReportesPorChofer(req: Request, res: Response, next: NextFunction) {
  try {
    const idChofer = Number(req.params.id);
    const reportes = await obtenerReportesPorChofer(idChofer);

    return res.status(200).json({
      success: true,
      message: "Reportes del chofer cargados",
      data: reportes
    });
  } catch (error) {
    next(error);
  }
}
