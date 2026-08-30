import { Request, Response } from "express"
import * as servicioService from "../services/servicios.service"
import { Servicios } from "../models/Servicios"

export async function listarServicios(res: Response) {
    res.status(200).json({
        success: true,
        message: "Servicios cargados correctamente",
        data: await servicioService.listarServicios()
    });
}

export async function obtenerServicioPorId(req: Request, res: Response) {
    const { id } = req.body;
    res.status(200).json({
        success: true,
        message: `Servicio con id: ${id} encontrado`,
        data: await servicioService.buscarServicio(id)
    });
}

export async function crearServicio(req: Request, res: Response) {
    const { id_proveedor, nombre, descripcion, precio_mensual, estado, fecha_creacion } = req.body;
    const newServicio: Servicios = { id_proveedor, nombre, descripcion, precio_mensual, estado, fecha_creacion }
    res.status(201).json({
        success: true,
        message: 'Servicio creado',
        data: await servicioService.agregarServicio(newServicio)
    })
}

export async function editarServicio(req: Request, res: Response) {
    const { id, id_proveedor, nombre, descripcion, precio_mensual, estado, fecha_creacion } = req.body;
    const newServicio: Servicios = { id_proveedor, nombre, descripcion, precio_mensual, estado, fecha_creacion }
    res.status(200).json({
        success: true,
        message: `Servicio con id: ${id} editado`,
        data: await servicioService.actualizarServicio(id, newServicio)
    })
}

export async function eliminarServicio(req: Request, res: Response) {
    const { id } = req.body;
    res.status(200).json({
        success: true,
        message: `Servicio con id: ${id} eliminado`,
        data: await servicioService.eliminarServicio(id)
    });
}
