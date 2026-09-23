import { NextFunction, Request, Response } from "express";
import { listarProveedores } from "../services/proveedores.service";
import { listarRutas } from "../services/rutas.service";
import { listarServicios } from "../services/servicios.service";
import { listarValoraciones, listarValoracionesDetalle } from "../services/valoraciones.service";

export async function obtenerProveedores1(_req: Request, res: Response, next: NextFunction) {
    try {
        return res.status(200).json({
            success: true,
            message: "Proveedores cargados correctamente",
            data: await listarProveedores(),
        });
    } catch (error) {
        next(error);
    }
}

export async function obtenerRutas1(_req: Request, res: Response, next: NextFunction) {
    try {
        return res.status(200).json({
            success: true,
            message: "Rutas cargadas correctamente",
            data: await listarRutas(),
        });
    } catch (error) {
        next(error);
    }
}

export async function obtenerServicios1(_req: Request, res: Response, next: NextFunction) {
    try {
        return res.status(200).json({
            success: true,
            message: "Servicios cargados correctamente",
            data: await listarServicios(),
        });
    } catch (error) {
        next(error);
    }
}

export async function getValoraciones1(_req: Request, res: Response, next: NextFunction) {
    try {
        return res.status(200).json({
            success: true,
            message: "Valoraciones cargadas",
            data: await listarValoraciones(),
        });
    } catch (error) {
        next(error);
    }
}

export async function getValoracionesDetalleLanding(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return res.status(200).json({
            success: true,
            message: "Valoraciones detalladas cargadas",
            data: await listarValoracionesDetalle(),
        });
    } catch (error) {
        next(error);
    }
}
