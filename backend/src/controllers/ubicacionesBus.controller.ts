import { Request, Response, NextFunction } from "express";
import { agregarUbicacionBus, buscarUbicacionBusById, editarUbicacionBusById, eliminarUbicacionBusById, listarUbicacionesBus } from "../services/ubicacionesBus.service";
import { UbicacionesBus } from "../models/ubicacionesBus";

export async function getUbicacionesBus(_req: Request, res: Response, next: NextFunction) {
    try {
        const ubicaciones = await listarUbicacionesBus();
        return res.status(200).json({
            success: true,
            message: "Ubicaciones cargadas correctamente",
            data: ubicaciones
        });
    } catch (error) {
        next(error);
    }
}

export async function getUbicacionBusById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const ubicacion = await buscarUbicacionBusById(id);

        return res.status(200).json({
            success: true,
            message: `Ubicación con id: ${id} encontrada`,
            data: ubicacion
        });
    } catch (error) {
        next(error);
    }
}

export async function postUbicacionBus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id_viaje, latitud, longitud, velocidad, fecha_hora } = req.body;
        const newUbicacion: UbicacionesBus = { id_viaje, latitud, longitud, velocidad, fecha_hora };

        const ubicacionCreada = await agregarUbicacionBus(newUbicacion);
        return res.status(201).json({
            success: true,
            message: 'Ubicación creada',
            data: ubicacionCreada
        });
    } catch (error) {
        next(error);
    }
}

export async function putUbicacionBusByID(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const { id_viaje, latitud, longitud, velocidad, fecha_hora } = req.body;
        const newUbicacion: UbicacionesBus = { id_viaje, latitud, longitud, velocidad, fecha_hora };

        const ubicacionEditada = await editarUbicacionBusById(id, newUbicacion);
        return res.status(200).json({
            success: true,
            message: `Ubicación con id: ${id} editada`,
            data: ubicacionEditada
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteUbicacionBusById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const resultado = await eliminarUbicacionBusById(id);

        return res.status(200).json({
            success: true,
            message: `Ubicación con id: ${id} eliminada`,
            data: resultado
        });
    } catch (error) {
        next(error);
    }
}