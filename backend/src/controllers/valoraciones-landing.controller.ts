import { NextFunction, Request, Response } from "express";
import { listarProveedores } from "../services/proveedores.service";
import { listarRutas } from "../services/rutas.service";
import { listarServicios } from "../services/servicios.service";
import { listarValoraciones } from "../services/valoraciones.service";
import { errorThrower } from "../utils/middleware/errorThrower";
import { pool } from "../config/conexion";

export async function obtenerProveedores1(_req: Request, res: Response, next: NextFunction) {
    try {
        const proveedores = await listarProveedores();
        return res.status(200).json({
            success: true,
            message: "Proveedores cargados correctamente",
            data: proveedores
        });
    } catch (error) {
        next(error);
    }
}

export async function obtenerRutas1(_req: Request, res: Response, next: NextFunction) {
    try {
        const rutas = await listarRutas();
        return res.status(200).json({
            success: true,
            message: "Rutas cargadas correctamente",
            data: rutas
        });
    } catch (error) {
        next(error);
    }
}

export async function obtenerServicios1(_req: Request, res: Response, next: NextFunction) {
    try {
        const servicios = await listarServicios();
        return res.status(200).json({
            success: true,
            message: "Servicios cargados correctamente",
            data: servicios
        });
    } catch (error) {
        next(error);
    }
}

export async function getValoraciones1(req: Request, res: Response, next: NextFunction){
    try{
        const datos = await listarValoraciones();
        return res.status(200).json({
            success: true,
            message: "Valoraciones cargadas",
            data: datos
        });
    }catch(error){
        next(error)
    }
}
