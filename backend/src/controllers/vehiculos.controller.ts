import { Request, Response } from "express"
import * as vehiculoService from "../services/vehiculos.service"
import { Vehiculos } from "../models/Vehiculos"

export async function listarVehiculos(res: Response) {
    res.status(200).json({
        success: true,
        message: "Vehiculos cargados correctamente",
        data: await vehiculoService.listarVehiculos()
    });
}

export async function obtenerVehiculoPorId(req: Request, res: Response) {
    const { id } = req.body;
    res.status(200).json({
        success: true,
        message: `Vehiculo con id: ${id} encontrado`,
        data: await vehiculoService.buscarVehiculo(id)
    });
}

export async function crearVehiculo(req: Request, res: Response) {
    const { id_proveedor, placa, foto_vehiculo, estado } = req.body;
    const newVehiculo: Vehiculos = { id_proveedor, placa, foto_vehiculo, estado }
    res.status(201).json({
        success: true,
        message: 'Vehiculo creado',
        data: await vehiculoService.agregarVehiculo(newVehiculo)
    })
}

export async function editarVehiculo(req: Request, res: Response) {
    const { id, id_proveedor, placa, foto_vehiculo, estado } = req.body;
    const newVehiculo: Vehiculos = { id_proveedor, placa, foto_vehiculo, estado }
    res.status(200).json({
        success: true,
        message: `Vehiculo con id: ${id} editado`,
        data: await vehiculoService.actualizarVehiculo(id, newVehiculo)
    })
}

export async function eliminarVehiculo(req: Request, res: Response) {
    const { id } = req.body;
    res.status(200).json({
        success: true,
        message: `Vehiculo con id: ${id} eliminado`,
        data: await vehiculoService.eliminarVehiculo(id)
    });
}