import { obtenerKpisUsuarios } from "../services/kpis.service";
import { Request, Response, NextFunction } from "express";


export async function getUsuariosKpis(_req: Request, res: Response, next: NextFunction) {
    try {
        const kpis = await obtenerKpisUsuarios();
        return res.status(200).json({
            success: true,
            message: "KPIs cargados correctamente",
            data: kpis
        });
    } catch (error) {
        next(error);
    }
}