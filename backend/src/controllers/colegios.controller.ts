import { Request, Response, NextFunction } from "express";
import { actualizarColegio, agregarColegios, buscarColegioPorId, eliminarColegio, listarColegios } from "../services/colegios.service";
import { Colegios } from "../models/colegios";

export async function getColegios(req: Request, res: Response, next: NextFunction){
    try{
        const datos = await listarColegios();
        return res.status(200).json({
            success: true,
            message: "Colegios cargados",
            data: datos
        });
    }catch(error){
        next(error)
    }
}

export async function postColegios(req: Request, res: Response, next: NextFunction) {
    try{
        const { nombre, direccion, telefono_contacto } = req.body
        const nuevoColegio : Colegios = { id_colegio: 0, nombre, direccion, telefono_contacto }
        const colegioCreado = await agregarColegios(nuevoColegio);
        return res.status(201).json({
            success: true,
            message: "Colegio creado",
            data: colegioCreado
        });
    }catch(error){
        next(error);
    }
}

export async function getColegioById(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const colegioEncontrado = await buscarColegioPorId(id);
        return res.status(200).json({
            success: true,
            message: `Colegio con id: ${id} encontrado`,
            data: colegioEncontrado
        });
    }catch(error){
        next(error);
    }
}

export async function putColegio(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const { nombre, direccion, telefono_contacto } = req.body;
        const colegioActualizar : Colegios = { id_colegio: id, nombre, direccion, telefono_contacto }
        const colegioEditado = await actualizarColegio(colegioActualizar, id);

        return res.status(200).json({
            success: true,
            message: "Colegio editado",
            data: colegioEditado
        })
    }catch(error){
        next(error);
    }
}

export async function deleteColegio(req: Request, res: Response, next: NextFunction){
    try{
        const id = Number(req.params.id);
        const resultado = await eliminarColegio(id);
         
        return res.status(200).json({
            sucess: true,
            message: "Colegio eliminado",
            data: resultado
        })
    }catch(error){
        next(error);
    }
}