import { Request, Response, NextFunction } from "express";
import { listarVehiculos, buscarVehiculo, agregarVehiculo, actualizarVehiculo, eliminarVehiculo } from "../services/vehiculos.service";
import { Vehiculos } from "../models/Vehiculos";

export async function obtenerVehiculos(_req: Request, res: Response, next: NextFunction) {
    try {
        const vehiculos = await listarVehiculos();
        return res.status(200).json({
            success: true,
            message: "Vehiculos cargados correctamente",
            data: vehiculos
        });
    } catch (error) {
        next(error);
    }
}

export async function obtenerVehiculoPorId(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const vehiculo = await buscarVehiculo(id);

        return res.status(200).json({
            success: true,
            message: `Vehiculo con id: ${id} encontrado`,
            data: vehiculo
        });
    } catch (error) {
        next(error);
    }
}

export async function crearVehiculo(req: Request, res: Response, next: NextFunction) {
    try {
        const { id_proveedor, placa, foto_vehiculo, estado } = req.body;
        const newVehiculo: Vehiculos = { id_proveedor, placa, foto_vehiculo, estado };

        const vehiculoCreado = await agregarVehiculo(newVehiculo);
        return res.status(201).json({
            success: true,
            message: 'Vehiculo creado',
            data: vehiculoCreado
        });
    } catch (error) {
        next(error);
    }
}

export async function editarVehiculo(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const { id_proveedor, placa, foto_vehiculo, estado } = req.body;
        const newVehiculo: Vehiculos = { id_proveedor, placa, foto_vehiculo, estado };

        const vehiculoEditado = await actualizarVehiculo(id, newVehiculo);
        return res.status(200).json({
            success: true,
            message: `Vehiculo con id: ${id} editado`,
            data: vehiculoEditado
        });
    } catch (error) {
        next(error);
    }
}

export async function eliminarVehiculos(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const resultado = await eliminarVehiculo(id);

        return res.status(200).json({
            success: true,
            message: `Vehiculo con id: ${id} eliminado`,
            data: resultado
        });
    } catch (error) {
        next(error);
    }
}