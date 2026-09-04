import { Request, Response, NextFunction } from "express";
import { agregarViaje, buscarViajeById, editarViajeById, eliminarViajeById, listarViajes } from "../services/viajes.service";
import { Viajes } from "../models/viajes";

export async function getViajes(_req: Request, res: Response, next: NextFunction) {
    try {
        const viajes = await listarViajes();
        return res.status(200).json({
            success: true,
            message: "Viajes cargados correctamente",
            data: viajes
        });
    } catch (error) {
        next(error);
    }
}

export async function getViajeById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const viaje = await buscarViajeById(id);

        return res.status(200).json({
            success: true,
            message: `Viaje con id: ${id} encontrado`,
            data: viaje
        });
    } catch (error) {
        next(error);
    }
}

export async function postViaje(req: Request, res: Response, next: NextFunction) {
    try {
        const { id_ruta, id_chofer, id_vehiculo, fecha_viaje, hora_inicio, hora_fin, estado } = req.body;
        const newViaje: Viajes = { id_ruta, id_chofer, id_vehiculo, fecha_viaje, hora_inicio, hora_fin, estado };

        const viajeCreado = await agregarViaje(newViaje);
        return res.status(201).json({
            success: true,
            message: 'Viaje creado',
            data: viajeCreado
        });
    } catch (error) {
        next(error);
    }
}

export async function putViajeByID(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const { id_ruta, id_chofer, id_vehiculo, fecha_viaje, hora_inicio, hora_fin, estado } = req.body;
        const newViaje: Viajes = { id_ruta, id_chofer, id_vehiculo, fecha_viaje, hora_inicio, hora_fin, estado };

        const viajeEditado = await editarViajeById(id, newViaje);
        return res.status(200).json({
            success: true,
            message: `Viaje con id: ${id} editado`,
            data: viajeEditado
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteViajeById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const resultado = await eliminarViajeById(id);

        return res.status(200).json({
            success: true,
            message: `Viaje con id: ${id} eliminado`,
            data: resultado
        });
    } catch (error) {
        next(error);
    }
}