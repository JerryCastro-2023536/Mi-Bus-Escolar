import { Request, Response, NextFunction } from "express";
import { Notificaciones } from "../models/Notificaciones";
import { listarNotificaciones, agregarNotificacion, buscarNotificacionById, editarNotificacionById, eliminarNotificacionById } from "../services/notificaciones.service";

export async function getNotificaciones(req: Request, res: Response, next: NextFunction){
    try{
        const datos = await listarNotificaciones();
        return res.status(200).json({
            success: true,
            message: "Notificaciones cargadas",
            data: datos
        });
    }catch(error){
        next(error)
    }
}

export async function postNotificaciones(req: Request, res: Response, next: NextFunction) {
    const { id_usuario, id_incidencia, id_asistencia, tipo, titulo, mensaje, leida, fecha_envio } = req.body
    const nuevaNotificacion : Notificaciones = { id_usuario, id_incidencia, id_asistencia, tipo, titulo, mensaje, leida, fecha_envio } 
    const notificacionCreada = await agregarNotificacion(nuevaNotificacion);
    try{
        return res.status(201).json({
            success: true,
            message: "Notificacion creada",
            data: notificacionCreada
        });
    }catch(error){
        next(error);
    }
}

export async function getNotificacionById(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const notificacionEncontrada = await buscarNotificacionById(id);
        return res.status(200).json({
            success: true,
            message: `Notificacion con id: ${id} encontrado`,
            data: notificacionEncontrada
        });
    }catch(error){
        next(error);
    }
}

export async function putNotificacion(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const { id_usuario, id_incidencia, id_asistencia, tipo, titulo, mensaje, leida, fecha_envio } = req.body;
        const notificacionActualizar : Notificaciones = { id_usuario, id_incidencia, id_asistencia, tipo, titulo, mensaje, leida, fecha_envio }
        const notificacionEditada = await editarNotificacionById(id, notificacionActualizar);

        return res.status(200).json({
            success: true,
            message: "Notificacion editada",
            data: notificacionEditada
        })
    }catch(error){
        next(error);
    }
}

export async function deleteNotificacion(req: Request, res: Response, next: NextFunction){
    try{
        const id = Number(req.params.id);
        const resultado = await eliminarNotificacionById(id);
         
        return res.status(200).json({
            sucess: true,
            message: "Notificacion eliminada",
            data: resultado
        })
    }catch(error){
        next(error);
    }
}
