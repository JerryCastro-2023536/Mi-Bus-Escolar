import { Request, Response } from "express"
import { listarIncidencias, agregarIncidencia, buscarIncidencia, actualizarIncidencia, eliminarIncidencia } from "../services/incidencias.service"
import { Incidencias } from "../models/Incidencias"

export async function obtenerIncidencias(res: Response) {
    res.status(200).json({
        success: true,
        message: "Incidencias cargadas correctamente",
        data: await listarIncidencias()
    });
}

export async function obtenerIncidenciaPorId(req: Request, res: Response) {
    const { id } = req.body;

    res.status(200).json({
        success: true,
        message: `Incidencia con id: ${id} encontrada`,
        data: await buscarIncidencia(id)
    });
}

export async function AgregarIncidencia(req: Request, res: Response) {
    const { id_viaje, id_ruta, id_usuario_reporta, titulo, descripcion, latitud, longitud, fecha_hora, estado } = req.body;
    const nuevaIncidencia: Incidencias = { id_viaje, id_ruta, id_usuario_reporta, titulo, descripcion, latitud, longitud, fecha_hora, estado }
    res.status(201).json({
        success: true,
        message: 'Incidencia creada',
        data: await agregarIncidencia(nuevaIncidencia)
    })
}

export async function editarIncidencia(req: Request, res: Response) {
    const { id, id_viaje, id_ruta, id_usuario_reporta, titulo, descripcion, latitud, longitud, fecha_hora, estado } = req.body;
    const nuevaIncidencia: Incidencias = { id_viaje, id_ruta, id_usuario_reporta, titulo, descripcion, latitud, longitud, fecha_hora, estado }
    res.status(200).json({
        success: true,
        message: `Incidencia con id: ${id} editada`,
        data: await actualizarIncidencia(id, nuevaIncidencia)
    })
}

export async function eliminarIncidenciaPorId(req: Request, res: Response) {
    const { id } = req.body;

    res.status(200).json({
        success: true,
        message: `Incidencia con id: ${id} eliminada`,
        data: await eliminarIncidencia(id)
    });
}