import { Request, Response, NextFunction } from "express";
import { agregarUsuario, buscarUsuarioById, editarUsuarioById, eliminarUsuarioById, listarUsuarios, login, register } from "../services/usuario.service";
import { Usuario, UsuarioRegisterDTO } from "../models/usuario";
import { generarToken } from "../utils/jwt";

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
        const { nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado } = req.body;
        const newUser: Usuario = { nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado };

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
        const { nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado } = req.body;
        const newUser: Usuario = { nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado };

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

export const loginUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { correo, password } = req.body;

        const validatedUser = await login({correo, password});

        const token = generarToken({
            id: validatedUser.id,
            email: validatedUser.correo,
            rol: validatedUser.rol
        });

        return res.status(200).json({
            message: 'Autenticación exitosa',
            token,
            usuario: validatedUser
        });
    } catch (error) {
        next(error);
    }
};

export const registerUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nombre, apellido, correo, password, telefono, foto_usuario } = req.body;

        const user: UsuarioRegisterDTO ={ nombre, apellido, correo, password, telefono, foto_usuario};
        const createdUser = await register(user);

        const token = generarToken({
            id: createdUser.id,
            email: createdUser.correo,
            rol: createdUser.rol
        });

        return res.status(201).json({
            message: 'Registro exitoso',
            token,
            usuario: createdUser
        });
    } catch (error) {
        next(error);
    }
};