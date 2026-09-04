import { Request, Response, NextFunction } from "express";
import { listarIncidencias, buscarIncidencia, agregarIncidencia, actualizarIncidencia, eliminarIncidencia } from "../services/incidencias.service";
import { Incidencias } from "../models/Incidencias";

export async function obtenerIncidencias(_req: Request, res: Response, next: NextFunction) {
    try {
        const incidencias = await listarIncidencias();
        return res.status(200).json({
            success: true,
            message: "Incidencias cargadas correctamente",
            data: incidencias
        });
    } catch (error) {
        next(error);
    }
}

export async function obtenerIncidenciaPorId(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const incidencia = await buscarIncidencia(id);

        return res.status(200).json({
            success: true,
            message: `Incidencia con id: ${id} encontrada`,
            data: incidencia
        });
    } catch (error) {
        next(error);
    }
}

export async function crearIncidencia(req: Request, res: Response, next: NextFunction) {
    try {
        const { id_viaje, id_ruta, id_usuario_reporta, titulo, descripcion, latitud, longitud, fecha_hora, estado } = req.body;
        const newIncidencia: Incidencias = { id_viaje, id_ruta, id_usuario_reporta, titulo, descripcion, latitud, longitud, fecha_hora, estado };

        const incidenciaCreada = await agregarIncidencia(newIncidencia);
        return res.status(201).json({
            success: true,
            message: 'Incidencia creada',
            data: incidenciaCreada
        });
    } catch (error) {
        next(error);
    }
}

export async function editarIncidencia(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const { id_viaje, id_ruta, id_usuario_reporta, titulo, descripcion, latitud, longitud, fecha_hora, estado } = req.body;
        const newIncidencia: Incidencias = { id_viaje, id_ruta, id_usuario_reporta, titulo, descripcion, latitud, longitud, fecha_hora, estado };

        const incidenciaEditada = await actualizarIncidencia(id, newIncidencia);
        return res.status(200).json({
            success: true,
            message: `Incidencia con id: ${id} editada`,
            data: incidenciaEditada
        });
    } catch (error) {
        next(error);
    }
}

export async function eliminarIncidencias(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const resultado = await eliminarIncidencia(id);

        return res.status(200).json({
            success: true,
            message: `Incidencia con id: ${id} eliminada`,
            data: resultado
        });
    } catch (error) {
        next(error);
    }
}