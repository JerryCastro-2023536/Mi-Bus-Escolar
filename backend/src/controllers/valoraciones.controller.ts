import { NextFunction, Request, Response } from "express";
import {
    actualizarValoracion,
    agregarValoraciones,
    buscarValoracionPorId,
    eliminarValoracion,
    guardarValoracionServicio,
    listarValoraciones,
    listarValoracionesDetalle,
} from "../services/valoraciones.service";
import { Valoraciones } from "../models/valoraciones";

export async function getValoraciones(_req: Request, res: Response, next: NextFunction) {
    try {
        const datos = await listarValoraciones();
        return res.status(200).json({
            success: true,
            message: "Valoraciones cargadas",
            data: datos,
        });
    } catch (error) {
        next(error);
    }
}

export async function getValoracionesDetalle(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const datos = await listarValoracionesDetalle();
        return res.status(200).json({
            success: true,
            message: "Valoraciones con información del servicio y usuario cargadas",
            data: datos,
        });
    } catch (error) {
        next(error);
    }
}

export async function postValoraciones(req: Request, res: Response, next: NextFunction) {
    try {
        const { id_servicio, id_usuario, comentario, calificacion } = req.body;
        const nuevaValoracion: Valoraciones = {
            id_valoracion: 0,
            id_servicio,
            id_usuario,
            comentario: comentario ?? null,
            calificacion,
        };

        const valoracionCreada = await agregarValoraciones(nuevaValoracion);
        return res.status(201).json({
            success: true,
            message: "Valoración creada",
            data: valoracionCreada,
        });
    } catch (error) {
        next(error);
    }
}

export async function postValoracionServicio(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const idServicio = Number(req.params.idServicio);
        const idUsuario = Number(req.user?.id);

        if (!Number.isInteger(idServicio) || idServicio <= 0) {
            return res.status(400).json({
                success: false,
                message: "El ID del servicio no es válido",
            });
        }

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(401).json({
                success: false,
                message: "No se encontró el usuario autenticado",
            });
        }

        const data = await guardarValoracionServicio(idServicio, idUsuario, {
            comentario: req.body.comentario ?? null,
            calificacion: req.body.calificacion,
        });

        return res.status(200).json({
            success: true,
            message: "Tu valoración fue guardada correctamente",
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function getValoracionById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const valoracionEncontrada = await buscarValoracionPorId(id);
        return res.status(200).json({
            success: true,
            message: `Valoración con id: ${id} encontrada`,
            data: valoracionEncontrada,
        });
    } catch (error) {
        next(error);
    }
}

export async function putValoracion(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const { id_servicio, id_usuario, comentario, calificacion } = req.body;
        const valoracionActualizar: Valoraciones = {
            id_valoracion: id,
            id_servicio,
            id_usuario,
            comentario: comentario ?? null,
            calificacion,
        };

        const valoracionEditada = await actualizarValoracion(valoracionActualizar, id);

        return res.status(200).json({
            success: true,
            message: "Valoración editada",
            data: valoracionEditada,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteValoracion(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const resultado = await eliminarValoracion(id);

        return res.status(200).json({
            success: true,
            message: "Valoración eliminada",
            data: resultado,
        });
    } catch (error) {
        next(error);
    }
}
