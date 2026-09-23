import { Request, Response, NextFunction } from "express";
import { listarRutas, buscarRuta, agregarRuta, actualizarRuta, eliminarRuta } from "../services/rutas.service";
import { Rutas } from "../models/Rutas";

export async function obtenerRutas(_req: Request, res: Response, next: NextFunction) {
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

export async function obtenerRutaPorId(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const ruta = await buscarRuta(id);

        return res.status(200).json({
            success: true,
            message: `Ruta con id: ${id} encontrada`,
            data: ruta
        });
    } catch (error) {
        next(error);
    }
}

export async function crearRuta(req: Request, res: Response, next: NextFunction) {
    try {
        const { id_servicio, id_vehiculo, id_chofer, nombre, hora_inicio_estimada, hora_fin_estimada, estado } = req.body;
        const newRuta: Rutas = { id_servicio, id_vehiculo, id_chofer, nombre, hora_inicio_estimada, hora_fin_estimada, estado };

        const rutaCreada = await agregarRuta(newRuta);
        return res.status(201).json({
            success: true,
            message: 'Ruta creada',
            data: rutaCreada
        });
    } catch (error) {
        next(error);
    }
}

export async function editarRuta(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const { id_servicio, id_vehiculo, id_chofer, nombre, hora_inicio_estimada, hora_fin_estimada, estado } = req.body;
        const newRuta: Rutas = { id_servicio, id_vehiculo, id_chofer, nombre, hora_inicio_estimada, hora_fin_estimada, estado };

        const rutaEditada = await actualizarRuta(id, newRuta);
        return res.status(200).json({
            success: true,
            message: `Ruta con id: ${id} editada`,
            data: rutaEditada
        });
    } catch (error) {
        next(error);
    }
}

export async function eliminarRutas(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const resultado = await eliminarRuta(id);

        return res.status(200).json({
            success: true,
            message: `Ruta con id: ${id} eliminada`,
            data: resultado
        });
    } catch (error) {
        next(error);
    }
}