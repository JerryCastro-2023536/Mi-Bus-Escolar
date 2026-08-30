import { Request, Response, NextFunction } from "express";
import { agregarUsuario, buscarUsuarioById, editarUsuarioById, eliminarUsuarioById, listarUsuarios } from "../services/usuario.services";
import { Usuario } from "../models/usuario";

export async function getUsuarios(_req: Request, res: Response, next: NextFunction) {
    try {
        const usuarios = await listarUsuarios();
        return res.status(200).json({
            success: true,
            message: "Usuarios cargados correctamente",
            data: usuarios
        });
    } catch (error) {
        next(error);
    }
}
export async function getUsuarioById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const usuario = await buscarUsuarioById(id);

        return res.status(200).json({
            success: true,
            message: `Usuario con id: ${id} encontrado`,
            data: usuario
        });
    } catch (error) {
        next(error);
    }
}

export async function postUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const { nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado, fecha_creacion, fecha_actualizacion } = req.body;
        const newUser: Usuario = { nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado, fecha_creacion, fecha_actualizacion };

        const usuarioCreado = await agregarUsuario(newUser);
        return res.status(201).json({
            success: true,
            message: 'Usuario creado',
            data: usuarioCreado
        });
    } catch (error) {
        next(error);
    }
}

export async function putUsuarioByID(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const { nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado, fecha_creacion, fecha_actualizacion } = req.body;
        const newUser: Usuario = { nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado, fecha_creacion, fecha_actualizacion };

        const usuarioEditado = await editarUsuarioById(id, newUser);
        return res.status(200).json({
            success: true,
            message: `Usuario con id: ${id} editado`,
            data: usuarioEditado
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteUsuarioById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const resultado = await eliminarUsuarioById(id);

        return res.status(200).json({
            success: true,
            message: `Usuario con id: ${id} eliminado`,
            data: resultado
        });
    } catch (error) {
        next(error);
    }
}