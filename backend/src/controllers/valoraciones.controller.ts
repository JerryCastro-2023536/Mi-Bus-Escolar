import { Request, Response, NextFunction } from "express";
import { actualizarValoracion, agregarValoraciones, buscarValoracionPorId, eliminarValoracion, listarValoraciones } from "../services/valoraciones.service";
import { Valoraciones } from "../models/valoraciones";

export async function getValoraciones(req: Request, res: Response, next: NextFunction){
    try{
        const datos = await listarValoraciones();
        return res.status(200).json({
            success: true,
            message: "Valoraciones cargadas",
            data: datos
        });
    }catch(error){
        next(error)
    }
}

export async function postValoraciones(req: Request, res: Response, next: NextFunction) {
    const { id_valoracion, id_proveedor, comentario, calificacion } = req.body
    const nuevaValoracion : Valoraciones = { id_valoracion, id_proveedor, comentario, calificacion }
    const valoracionCreada = await agregarValoraciones(nuevaValoracion);
    try{
        return res.status(201).json({
            success: true,
            message: "Valoración creada",
            data: valoracionCreada
        });
    }catch(error){
        next(error);
    }
}

export async function getValoracionById(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const valoracionEncontrada = await buscarValoracionPorId(id);
        return res.status(200).json({
            success: true,
            message: `Valoración con id: ${id} encontrada`,
            data: valoracionEncontrada
        });
    }catch(error){
        next(error);
    }
}

export async function putValoracion(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const { id_proveedor, comentario, calificacion } = req.body;
        const valoracionActualizar : Valoraciones = { id_valoracion: id, id_proveedor, comentario, calificacion }
        const valoracionEditada = await actualizarValoracion(valoracionActualizar, id);

        return res.status(200).json({
            success: true,
            message: "Valoración editada",
            data: valoracionEditada
        })
    }catch(error){
        next(error);
    }
}

export async function deleteValoracion(req: Request, res: Response, next: NextFunction){
    try{
        const id = Number(req.params.id);
        const resultado = await eliminarValoracion(id);
         
        return res.status(200).json({
            sucess: true,
            message: "Valoración eliminada",
            data: resultado
        })
    }catch(error){
        next(error);
    }
}