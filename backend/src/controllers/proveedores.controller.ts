import { Request, Response, NextFunction } from "express";
import { listarProveedores, buscarProveedor, agregarProveedor, actualizarProveedor, eliminarProveedor } from "../services/proveedores.service";
import { Proveedores } from "../models/Proveedores";

export async function obtenerProveedores(_req: Request, res: Response, next: NextFunction) {
    try {
        const proveedores = await listarProveedores();
        return res.status(200).json({
            success: true,
            message: "Proveedores cargados correctamente",
            data: proveedores
        });
    } catch (error) {
        next(error);
    }
}

export async function obtenerProveedorPorId(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const proveedor = await buscarProveedor(id);

        return res.status(200).json({
            success: true,
            message: `Proveedor con id: ${id} encontrado`,
            data: proveedor
        });
    } catch (error) {
        next(error);
    }
}

export async function crearProveedor(req: Request, res: Response, next: NextFunction) {
    try {
        const { id_usuario, nombre_negocio, direccion, telefono_contacto } = req.body;
        const newProveedor: Proveedores = { id_usuario, nombre_negocio, direccion, telefono_contacto };

        const proveedorCreado = await agregarProveedor(newProveedor);
        return res.status(201).json({
            success: true,
            message: 'Proveedor creado',
            data: proveedorCreado
        });
    } catch (error) {
        next(error);
    }
}

export async function editarProveedor(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const { id_usuario, nombre_negocio, direccion, telefono_contacto } = req.body;
        const newProveedor: Proveedores = { id_usuario, nombre_negocio, direccion, telefono_contacto };

        const proveedorEditado = await actualizarProveedor(id, newProveedor);
        return res.status(200).json({
            success: true,
            message: `Proveedor con id: ${id} editado`,
            data: proveedorEditado
        });
    } catch (error) {
        next(error);
    }
}

export async function eliminarProveedores(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const resultado = await eliminarProveedor(id);

        return res.status(200).json({
            success: true,
            message: `Proveedor con id: ${id} eliminado`,
            data: resultado
        });
    } catch (error) {
        next(error);
    }
}