import { Request, Response, NextFunction } from "express";
import { editarAsistenciaById, agregarAsistencia, buscarAsistenciaById, eliminarAsistenciaById, listarAsistencias } from "../services/asistencias.service";
import { Asistencias } from "../models/asistencias";

export async function getAsistencias(req: Request, res: Response, next: NextFunction){
    try{
        const datos = await listarAsistencias();
        return res.status(200).json({
            success: true,
            message: "Asistencias cargadas",
            data: datos
        });
    }catch(error){
        next(error)
    }
}

export async function postAsistencias(req: Request, res: Response, next: NextFunction) {
    const { id_viaje, id_estudiante, estado_abordaje, hora_abordaje, estado_descenso, hora_descenso } = req.body
    const nuevaAsistencia : Asistencias = { id_asistencia: 0, id_viaje, id_estudiante, estado_abordaje, hora_abordaje, estado_descenso, hora_descenso }
    const asistenciaCreada = await agregarAsistencia(nuevaAsistencia);
    try{
        return res.status(201).json({
            success: true,
            message: "Asistencia creada",
            data: asistenciaCreada
        });
    }catch(error){
        next(error);
    }
}

export async function getAsistenciaById(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const asistenciaEncontrada = await buscarAsistenciaById(id);
        return res.status(200).json({
            success: true,
            message: `Asistencia con id: ${id} encontrada`,
            data: asistenciaEncontrada
        });
    }catch(error){
        next(error);
    }
}

export async function putAsistencia(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const { id_viaje, id_estudiante, estado_abordaje, hora_abordaje, estado_descenso, hora_descenso } = req.body;
        const asistenciaActualizar : Asistencias = { id_asistencia: id, id_viaje, id_estudiante, estado_abordaje, hora_abordaje, estado_descenso, hora_descenso }
        const asistenciaEditada = await editarAsistenciaById(id, asistenciaActualizar);

        return res.status(200).json({
            success: true,
            message: "Asistencia editada",
            data: asistenciaEditada
        })
    }catch(error){
        next(error);
    }
}

export async function deleteAsistencia(req: Request, res: Response, next: NextFunction){
    try{
        const id = Number(req.params.id);
        const resultado = await eliminarAsistenciaById(id);
         
        return res.status(200).json({
            success: true,
            message: "Asistencia eliminada",
            data: resultado
        })
    }catch(error){
        next(error);
    }
}