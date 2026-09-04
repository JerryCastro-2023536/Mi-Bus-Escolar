import { Request, Response, NextFunction } from "express";
import { agregarRutaParada, buscarRutaParadaById, editarRutaParadaById, eliminarRutaParadaById, listarRutaParadas } from "../services/rutaParada.service";
import { RutaParada } from "../models/rutaParada";

export async function getRutaParadas(_req: Request, res: Response, next: NextFunction) {
    try {
        const rutasParadas = await listarRutaParadas();
        return res.status(200).json({
            success: true,
            message: "Rutas-Paradas cargadas correctamente",
            data: rutasParadas
        });
    } catch (error) {
        next(error);
    }
}

export async function getRutaParadaById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const rutaParada = await buscarRutaParadaById(id);

        return res.status(200).json({
            success: true,
            message: `Ruta-Parada con id: ${id} encontrada`,
            data: rutaParada
        });
    } catch (error) {
        next(error);
    }
}

export async function postRutaParada(req: Request, res: Response, next: NextFunction) {
    try {
        const { id_ruta, id_parada, orden_parada, minutos_estimados, hora_estimada } = req.body;
        const newRutaParada: RutaParada = { id_ruta, id_parada, orden_parada, minutos_estimados, hora_estimada };

        const rutaParadaCreada = await agregarRutaParada(newRutaParada);
        return res.status(201).json({
            success: true,
            message: 'Ruta-Parada creada',
            data: rutaParadaCreada
        });
    } catch (error) {
        next(error);
    }
}

export async function putRutaParadaByID(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const { id_ruta, id_parada, orden_parada, minutos_estimados, hora_estimada } = req.body;
        const newRutaParada: RutaParada = { id_ruta, id_parada, orden_parada, minutos_estimados, hora_estimada };

        const rutaParadaEditada = await editarRutaParadaById(id, newRutaParada);
        return res.status(200).json({
            success: true,
            message: `Ruta-Parada con id: ${id} editada`,
            data: rutaParadaEditada
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteRutaParadaById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const resultado = await eliminarRutaParadaById(id);

        return res.status(200).json({
            success: true,
            message: `Ruta-Parada con id: ${id} eliminada`,
            data: resultado
        });
    } catch (error) {
        next(error);
    }
}