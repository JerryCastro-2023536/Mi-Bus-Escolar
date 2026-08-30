import { Request, Response, NextFunction } from "express";
import { Asignaciones_Ruta } from "../models/Asignaciones_Rutas";
import { listarAsignacionesRutas, agregarAsignacionesRutas, buscarAsignacionRutaPorId, actualizarAsignacionRuta, eliminarAsignacionRuta } from "../services/asignaciones_rutas.service";

export async function getAsignacionesRutas(req: Request, res: Response, next: NextFunction){
    try{
        const datos = await listarAsignacionesRutas();
        return res.status(200).json({
            success: true,
            message: "Asignaciones cargadas",
            data: datos
        });
    }catch(error){
        next(error)
    }
}

export async function postAsignacionesRutas(req: Request, res: Response, next: NextFunction) {
    const { id_estudiante, id_ruta, id_parada_recogida, id_parada_descenso } = req.body
    const nuevaAsignacionRuta : Asignaciones_Ruta = { id_estudiante, id_ruta, id_parada_recogida, id_parada_descenso } 
    const asignacionRutaCreada = await agregarAsignacionesRutas(nuevaAsignacionRuta);
    try{
        return res.status(201).json({
            success: true,
            message: "Asignacion creada",
            data: asignacionRutaCreada
        });
    }catch(error){
        next(error);
    }
}

export async function getAsignacionRutaById(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const asignacionRutaEncontrada = await buscarAsignacionRutaPorId(id);
        return res.status(200).json({
            success: true,
            message: `Asignación con id: ${id} encontrado`,
            data: asignacionRutaEncontrada
        });
    }catch(error){
        next(error);
    }
}

export async function putAsignacionRuta(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const { id_estudiante, id_ruta, id_parada_recogida, id_parada_descenso } = req.body;
        const asignacionRutaActualizar : Asignaciones_Ruta = { id_estudiante, id_ruta, id_parada_recogida, id_parada_descenso }
        const asignacionRutaEditada = await actualizarAsignacionRuta(asignacionRutaActualizar, id);

        return res.status(200).json({
            success: true,
            message: "Asignación editada",
            data: asignacionRutaEditada
        })
    }catch(error){
        next(error);
    }
}

export async function deleteAsignacionRuta(req: Request, res: Response, next: NextFunction){
    try{
        const id = Number(req.params.id);
        const resultado = await eliminarAsignacionRuta(id);
         
        return res.status(200).json({
            sucess: true,
            message: "Asignación eliminada",
            data: resultado
        })
    }catch(error){
        next(error);
    }
}
