import { Request, Response, NextFunction } from "express";
import { listarServicios, buscarServicio, agregarServicio, actualizarServicio, eliminarServicio } from "../services/servicios.service";
import { Servicios } from "../models/Servicios";

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