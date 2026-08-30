import { Request, Response } from "express"
import { listarRutas, agregarRuta, buscarRuta, actualizarRuta, eliminarRuta } from "../services/rutas.service"
import { Rutas } from "../models/Rutas"

export async function listarRuta(res: Response) {
    res.status(200).json({
        success: true,
        message: "Rutas cargadas correctamente",
        data: await listarRutas()
    });
}

export async function obtenerRutaPorId(req: Request, res: Response) {
    const { id } = req.body;

    res.status(200).json({
        success: true,
        message: `Ruta con id: ${id} encontrada`,
        data: await buscarRuta(id)
    });
}

export async function agregarRutas(req: Request, res: Response) {
    const { id_servicio, id_vehiculo, id_chofer, nombre, hora_inicio_estimada, hora_fin_estimada, estado } = req.body;
    const nuevaRuta: Rutas = { id_servicio, id_vehiculo, id_chofer, nombre, hora_inicio_estimada, hora_fin_estimada, estado }
    res.status(201).json({
        success: true,
        message: 'Ruta creada',
        data: await agregarRuta(nuevaRuta)
    })
}

export async function editarRuta(req: Request, res: Response) {
    const { id, id_servicio, id_vehiculo, id_chofer, nombre, hora_inicio_estimada, hora_fin_estimada, estado } = req.body;
    const nuevaRuta: Rutas = { id_servicio, id_vehiculo, id_chofer, nombre, hora_inicio_estimada, hora_fin_estimada, estado }
    res.status(200).json({
        success: true,
        message: `Ruta con id: ${id} editada`,
        data: await actualizarRuta(id, nuevaRuta)
    })
}

export async function eliminarRutaPorId(req: Request, res: Response) {
    const { id } = req.body;

    res.status(200).json({
        success: true,
        message: `Ruta con id: ${id} eliminada`,
        data: await eliminarRuta(id)
    });
}