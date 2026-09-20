import { Request, Response, NextFunction } from "express";

import {
    listarVehiculos,
    buscarVehiculo,
    agregarVehiculo,
    actualizarVehiculo,
    eliminarVehiculo,

    listarVehiculosDelProveedor,
    registrarVehiculoProveedor,
    actualizarVehiculoProveedor,
    eliminarVehiculoProveedor
} from "../services/vehiculos.service";

import { Vehiculos } from "../models/Vehiculos";

import {
    ActualizarVehiculoProveedorDTO,
    NuevoVehiculoProveedorDTO
} from "../models/vehiculosProveedorDTO";

// ============================================================
// CRUD GENERAL DE VEHÍCULOS
// ============================================================

export async function obtenerVehiculos(
    _req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const vehiculos = await listarVehiculos();

        return res.status(200).json({
            success: true,
            message: "Vehículos cargados correctamente",
            data: vehiculos
        });
    } catch (error) {
        next(error);
    }
}

export async function obtenerVehiculoPorId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = Number(req.params.id);

        const vehiculo = await buscarVehiculo(id);

        return res.status(200).json({
            success: true,
            message: `Vehículo con id: ${id} encontrado`,
            data: vehiculo
        });
    } catch (error) {
        next(error);
    }
}

export async function crearVehiculo(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const {
            id_proveedor,
            placa,
            foto_vehiculo,
            estado
        } = req.body;

        const newVehiculo: Vehiculos = {
            id_proveedor,
            placa,
            foto_vehiculo,
            estado
        };

        const vehiculoCreado = await agregarVehiculo(
            newVehiculo
        );

        return res.status(201).json({
            success: true,
            message: "Vehículo creado",
            data: vehiculoCreado
        });
    } catch (error) {
        next(error);
    }
}

export async function editarVehiculo(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = Number(req.params.id);

        const {
            id_proveedor,
            placa,
            foto_vehiculo,
            estado
        } = req.body;

        const newVehiculo: Vehiculos = {
            id_proveedor,
            placa,
            foto_vehiculo,
            estado
        };

        const vehiculoEditado = await actualizarVehiculo(
            id,
            newVehiculo
        );

        return res.status(200).json({
            success: true,
            message: `Vehículo con id: ${id} editado`,
            data: vehiculoEditado
        });
    } catch (error) {
        next(error);
    }
}

export async function eliminarVehiculos(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = Number(req.params.id);

        const resultado = await eliminarVehiculo(id);

        return res.status(200).json({
            success: true,
            message: `Vehículo con id: ${id} eliminado`,
            data: resultado
        });
    } catch (error) {
        next(error);
    }
}

// ============================================================
// VEHÍCULOS DEL PROVEEDOR
// ============================================================

export async function getMisVehiculos(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id_usuario = Number(
            req.params.idUsuario
        );

        /*
         * El listado de "Mis vehículos" pertenece al módulo
         * de vehículos, por lo que utilizamos directamente
         * vehiculos.service.ts.
         */
        const vehiculos =
            await listarVehiculosDelProveedor(
                id_usuario
            );

        return res.status(200).json({
            success: true,
            message: "Vehículos cargados correctamente",
            data: vehiculos
        });
    } catch (error) {
        next(error);
    }
}

// ============================================================
// REGISTRAR VEHÍCULO DEL PROVEEDOR
// ============================================================

export async function postMiVehiculo(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id_usuario = Number(
            req.params.idUsuario
        );

        const {
            placa,
            foto_vehiculo
        } = req.body;

        const payload: NuevoVehiculoProveedorDTO = {
            placa,
            foto_vehiculo
        };

        const vehiculo =
            await registrarVehiculoProveedor(
                id_usuario,
                payload
            );

        return res.status(201).json({
            success: true,
            message: "Vehículo registrado correctamente",
            data: vehiculo
        });
    } catch (error) {
        next(error);
    }
}

// ============================================================
// ACTUALIZAR VEHÍCULO DEL PROVEEDOR
// ============================================================

export async function putMiVehiculo(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id_usuario = Number(
            req.params.idUsuario
        );

        const id_vehiculo = Number(
            req.params.idVehiculo
        );

        const {
            placa,
            foto_vehiculo,
            estado
        } = req.body;

        const payload: ActualizarVehiculoProveedorDTO = {
            placa,
            foto_vehiculo,
            estado
        };

        const vehiculo =
            await actualizarVehiculoProveedor(
                id_usuario,
                id_vehiculo,
                payload
            );

        return res.status(200).json({
            success: true,
            message: "Vehículo actualizado correctamente",
            data: vehiculo
        });
    } catch (error) {
        next(error);
    }
}

// ============================================================
// ELIMINAR VEHÍCULO DEL PROVEEDOR
// ============================================================

export async function deleteMiVehiculo(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id_usuario = Number(
            req.params.idUsuario
        );

        const id_vehiculo = Number(
            req.params.idVehiculo
        );

        const resultado =
            await eliminarVehiculoProveedor(
                id_usuario,
                id_vehiculo
            );

        return res.status(200).json({
            success: true,
            message: "Vehículo eliminado correctamente",
            data: resultado
        });
    } catch (error) {
        next(error);
    }
}