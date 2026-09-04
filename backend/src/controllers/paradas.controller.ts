import { Request, Response, NextFunction } from "express";
import { actualizarParada, agregarParadas, buscarParadaPorId, eliminarParada, listarParadas } from "../services/paradas.service";
import { Paradas } from "../models/Paradas";

export async function getParadas(req: Request, res: Response, next: NextFunction){
    try{
        const datos = await listarParadas();
        return res.status(200).json({
            success: true,
            message: "Paradas cargadas",
            data: datos
        });
    }catch(error){
        next(error)
    }
}

export async function postParadas(req: Request, res: Response, next: NextFunction) {
    const { nombre, direccion, latitud, longitud } = req.body
    const nuevaParada : Paradas = { nombre, direccion, latitud, longitud } 
    const paradaCreada = await agregarParadas(nuevaParada);
    try{
        return res.status(201).json({
            success: true,
            message: "Parada creada",
            data: paradaCreada
        });
    }catch(error){
        next(error);
    }
}

export async function getParadaById(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const paradaEncontrada = await buscarParadaPorId(id);
        return res.status(200).json({
            success: true,
            message: `Usuario con id: ${id} encontrado`,
            data: paradaEncontrada
        });
    }catch(error){
        next(error);
    }
}

export async function putParada(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const { nombre, direccion, latitud, longitud } = req.body;
        const paradaActualizar : Paradas = { nombre, direccion, latitud, longitud }
        const paradaEditada = await actualizarParada(paradaActualizar, id);

        return res.status(200).json({
            success: true,
            message: "Parada editada",
            data: paradaEditada
        })
    }catch(error){
        next(error);
    }
}

export async function deleteParada(req: Request, res: Response, next: NextFunction){
    try{
        const id = Number(req.params.id);
        const resultado = await eliminarParada(id);
         
        return res.status(200).json({
            sucess: true,
            message: "Parada eliminada",
            data: resultado
        })
    }catch(error){
        next(error);
    }
}