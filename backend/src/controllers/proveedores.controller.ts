import { Request, Response } from "express"
import { listarProveedores, agregarProveedor, buscarProveedor, actualizarProveedor, eliminarProveedor } from "../services/proveedores.service"
import { Proveedores } from "../models/Proveedores"

export async function listarProveedor(res: Response) {
    res.status(200).json({
        success: true,
        message: "Proveedores cargados correctamente",
        data: await listarProveedores()
    });
}

export async function obtenerProveedorPorId(req: Request, res: Response) {
    const { id } = req.body;

    res.status(200).json({
        success: true,
        message: `Proveedor con id: ${id} encontrado`,
        data: await buscarProveedor(id)
    });
}

export async function agregarProveedores(req: Request, res: Response) {
    const { id_usuario, nombre_negocio, direccion, telefono_contacto } = req.body;
    const nuevaProveedor: Proveedores = { id_usuario, nombre_negocio, direccion, telefono_contacto }
    res.status(201).json({
        success: true,
        message: 'Proveedor creado',
        data: await agregarProveedor(nuevaProveedor)
    })
}

export async function editarProveedor(req: Request, res: Response) {
    const { id, id_usuario, nombre_negocio, direccion, telefono_contacto } = req.body;
    const nuevaProveedor: Proveedores = { id_usuario, nombre_negocio, direccion, telefono_contacto }
    res.status(200).json({
        success: true,
        message: `Proveedor con id: ${id} editado`,
        data: await actualizarProveedor(id, nuevaProveedor)
    })
}

export async function eliminarProveedorPorId(req: Request, res: Response) {
    const { id } = req.body;

    res.status(200).json({
        success: true,
        message: `Proveedor con id: ${id} eliminado`,
        data: await eliminarProveedor(id)
    });
}