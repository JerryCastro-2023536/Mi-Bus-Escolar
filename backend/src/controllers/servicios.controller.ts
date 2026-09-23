import { Request, Response, NextFunction } from "express";
import { listarServicios, buscarServicio, agregarServicio, actualizarServicio, eliminarServicio, listarServiciosDelProveedor, registrarServicioProveedor, actualizarServicioProveedor, eliminarServicioProveedor } from "../services/servicios.service";
import { Servicios } from "../models/Servicios";
import { ActualizarServicioProveedorDTO, NuevoServicioProveedorDTO } from "../models/serviciosBusDTO";

export async function obtenerServicios(_req: Request, res: Response, next: NextFunction) {
    try {
        const servicios = await listarServicios();
        return res.status(200).json({
            success: true,
            message: "Servicios cargados correctamente",
            data: servicios
        });
    } catch (error) {
        next(error);
    }
}

export async function obtenerServicioPorId(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const servicio = await buscarServicio(id);

        return res.status(200).json({
            success: true,
            message: `Servicio con id: ${id} encontrado`,
            data: servicio
        });
    } catch (error) {
        next(error);
    }
}

export async function crearServicio(req: Request, res: Response, next: NextFunction) {
    try {
        const { id_proveedor, nombre, descripcion, precio_mensual, estado, fecha_creacion } = req.body;
        const newServicio: Servicios = { id_proveedor, nombre, descripcion, precio_mensual, estado, fecha_creacion };

        const servicioCreado = await agregarServicio(newServicio);
        return res.status(201).json({
            success: true,
            message: 'Servicio creado',
            data: servicioCreado
        });
    } catch (error) {
        next(error);
    }
}

export async function editarServicio(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const { id_proveedor, nombre, descripcion, precio_mensual, estado, fecha_creacion } = req.body;
        const newServicio: Servicios = { id_proveedor, nombre, descripcion, precio_mensual, estado, fecha_creacion };

        const servicioEditado = await actualizarServicio(id, newServicio);
        return res.status(200).json({
            success: true,
            message: `Servicio con id: ${id} editado`,
            data: servicioEditado
        });
    } catch (error) {
        next(error);
    }
}

export async function eliminarServicios(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const resultado = await eliminarServicio(id);

        return res.status(200).json({
            success: true,
            message: `Servicio con id: ${id} eliminado`,
            data: resultado
        });
    } catch (error) {
        next(error);
    }
}

//ADMINISTRAR PROVEEDOR

export async function getMisServicios(req: Request, res: Response, next: NextFunction) {
    try {
        const id_usuario = Number(req.params.idUsuario);
        const servicios = await listarServiciosDelProveedor(id_usuario);

        return res.status(200).json({
            success: true,
            message: 'Servicios cargados correctamente',
            data: servicios
        });
    } catch (error) {
        next(error);
    }
}

export async function postMiServicio(req: Request, res: Response, next: NextFunction) {
    try {
        const id_usuario = Number(req.params.idUsuario);
        const { nombre, descripcion, precio_mensual } = req.body;

        const payload: NuevoServicioProveedorDTO = { nombre, descripcion, precio_mensual };
        const servicio = await registrarServicioProveedor(id_usuario, payload);

        return res.status(201).json({
            success: true,
            message: 'Servicio registrado correctamente',
            data: servicio
        });
    } catch (error) {
        next(error);
    }
}

export async function putMiServicio(req: Request, res: Response, next: NextFunction) {
    try {
        const id_usuario = Number(req.params.idUsuario);
        const id_servicio = Number(req.params.idServicio);
        const { nombre, descripcion, precio_mensual, estado } = req.body;

        const payload: ActualizarServicioProveedorDTO = { nombre, descripcion, precio_mensual, estado };
        const servicio = await actualizarServicioProveedor(id_usuario, id_servicio, payload);

        return res.status(200).json({
            success: true,
            message: 'Servicio actualizado correctamente',
            data: servicio
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteMiServicio(req: Request, res: Response, next: NextFunction) {
    try {
        const id_usuario = Number(req.params.idUsuario);
        const id_servicio = Number(req.params.idServicio);
        const resultado = await eliminarServicioProveedor(id_usuario, id_servicio);

        return res.status(200).json({
            success: true,
            message: 'Servicio eliminado correctamente',
            data: resultado
        });
    } catch (error) {
        next(error);
    }
}