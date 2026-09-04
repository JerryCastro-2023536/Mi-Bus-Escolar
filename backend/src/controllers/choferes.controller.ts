import { Request, Response, NextFunction } from "express";
import { actualizarChofer, agregarChoferes, buscarChoferPorId, eliminarChofer, listarChoferes } from "../services/choferes.service";
import { Choferes } from "../models/choferes";

export async function getChoferes(req: Request, res: Response, next: NextFunction){
    try{
        const datos = await listarChoferes();
        return res.status(200).json({
            success: true,
            message: "Choferes cargados",
            data: datos
        });
    }catch(error){
        next(error)
    }
}

export async function postChoferes(req: Request, res: Response, next: NextFunction) {
    const { id_chofer, id_usuario, telefono_contacto, estado } = req.body
    const nuevoChofer : Choferes = { id_chofer, id_usuario, telefono_contacto, estado }
    const choferCreado = await agregarChoferes(nuevoChofer);
    try{
        return res.status(201).json({
            success: true,
            message: "Chofer creado",
            data: choferCreado
        });
    }catch(error){
        next(error);
    }
}

export async function getChoferById(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const choferEncontrado = await buscarChoferPorId(id);
        return res.status(200).json({
            success: true,
            message: `Chofer con id: ${id} encontrado`,
            data: choferEncontrado
        });
    }catch(error){
        next(error);
    }
}

export async function putChofer(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const { id_chofer, id_usuario, telefono_contacto, estado } = req.body;
        const choferActualizar : Choferes = { id_chofer, id_usuario, telefono_contacto, estado }
        const choferEditado = await actualizarChofer(choferActualizar, id);

        return res.status(200).json({
            success: true,
            message: "Chofer editado",
            data: choferEditado
        })
    }catch(error){
        next(error);
    }
}

export async function deleteChofer(req: Request, res: Response, next: NextFunction){
    try{
        const id = Number(req.params.id);
        const resultado = await eliminarChofer(id);
         
        return res.status(200).json({
            success: true,
            message: "Chofer eliminado",
            data: resultado
        })
    }catch(error){
        next(error);
    }
}