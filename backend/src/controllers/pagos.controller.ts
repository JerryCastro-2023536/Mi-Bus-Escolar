import { Request, Response, NextFunction } from "express";

import { Pagos, RegistrarPagoDTO } from "../models/Pagos";
import { editarPagoById, agregarPago, buscarPagoById, eliminarPagoById, listarPagos, buscarDetallePago, registrarPago, listarMesesPendientes, listarEstudiantesPorTutor, listarServiciosProveedor, listarEstudiantesPorServicio, listarMesesEstudianteProveedor } from "../services/pagos.service";

export async function getPagos(req: Request, res: Response, next: NextFunction) {
    try {
        const datos = await listarPagos();
        return res.status(200).json({
            success: true,
            message: "Pagos cargados",
            data: datos
        });
    } catch (error) {
        next(error)
    }
}

export async function postPagos(req: Request, res: Response, next: NextFunction) {
    const { id_estudiante, id_servicio, periodo_mes, periodo_anio, monto, metodo_pago, referencia_pago, foto_comprobante, estado, fecha_pago_limite, fecha_verificacion, verificado_por, observaciones } = req.body
    const nuevoPago: Pagos = { id_estudiante, id_servicio, periodo_mes, periodo_anio, monto, metodo_pago, referencia_pago, foto_comprobante, estado, fecha_pago_limite, fecha_verificacion, verificado_por, observaciones }
    const pagoCreado = await agregarPago(nuevoPago);
    try {
        return res.status(201).json({
            success: true,
            message: "Pago creado",
            data: pagoCreado
        });
    } catch (error) {
        next(error);
    }
}

export async function getPagoById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const pagoEncontrado = await buscarPagoById(id);
        return res.status(200).json({
            success: true,
            message: `Pago con id: ${id} encontrado`,
            data: pagoEncontrado
        });
    } catch (error) {
        next(error);
    }
}

export async function putPago(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const { id_estudiante, id_servicio, periodo_mes, periodo_anio, monto, metodo_pago, referencia_pago, foto_comprobante, estado, fecha_pago_limite, fecha_verificacion, verificado_por, observaciones } = req.body;
        const pagoActualizar: Pagos = { id_estudiante, id_servicio, periodo_mes, periodo_anio, monto, metodo_pago, referencia_pago, foto_comprobante, estado, fecha_pago_limite, fecha_verificacion, verificado_por, observaciones }
        const pagoEditado = await editarPagoById(id, pagoActualizar);

        return res.status(200).json({
            success: true,
            message: "Pago editado",
            data: pagoEditado
        })
    } catch (error) {
        next(error);
    }
}

export async function deletePago(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const resultado = await eliminarPagoById(id);

        return res.status(200).json({
            sucess: true,
            message: "Pago eliminado",
            data: resultado
        })
    } catch (error) {
        next(error);
    }
}

// Vista del usuario

export async function getEstudiantesPorTutor(req: Request, res: Response, next: NextFunction) {
    try {
        const id_usuario_tutor = Number(req.params.idUsuario);
        const estudiantes = await listarEstudiantesPorTutor(id_usuario_tutor);

        return res.status(200).json({
            success: true,
            message: 'Estudiantes cargados correctamente',
            data: estudiantes
        });
    } catch (error) {
        next(error);
    }
}

export async function getMesesPendientes(req: Request, res: Response, next: NextFunction) {
    try {
        const id_estudiante = Number(req.params.idEstudiante);
        const meses = await listarMesesPendientes(id_estudiante);

        return res.status(200).json({
            success: true,
            message: 'Meses cargados correctamente',
            data: meses
        });
    } catch (error) {
        next(error);
    }
}

export async function getDetallePago(req: Request, res: Response, next: NextFunction) {
    try {
        const id_estudiante = Number(req.params.idEstudiante);
        const id_servicio = Number(req.params.idServicio);
        const periodo_mes = Number(req.params.mes);
        const periodo_anio = Number(req.params.anio);

        const pago = await buscarDetallePago(id_estudiante, id_servicio, periodo_mes, periodo_anio);

        return res.status(200).json({
            success: true,
            message: 'Pago encontrado',
            data: pago
        });
    } catch (error) {
        next(error);
    }
}

export async function postRegistrarPago(req: Request, res: Response, next: NextFunction) {
    try {
        const {
            id_estudiante, id_servicio, periodo_mes, periodo_anio,
            monto, metodo_pago, referencia_pago, foto_comprobante
        } = req.body;

        const payload: RegistrarPagoDTO = {
            id_estudiante, id_servicio, periodo_mes, periodo_anio, metodo_pago, referencia_pago, foto_comprobante
        };

        const pago = await registrarPago(payload);

        return res.status(201).json({
            success: true,
            message: 'Pago registrado correctamente',
            data: pago
        });
    } catch (error) {
        next(error);
    }
}

// Vista del proveedor

export async function getServiciosProveedor(req: Request, res: Response, next: NextFunction) {
    try {
        const id_usuario = Number(req.params.idUsuario);
        const servicios = await listarServiciosProveedor(id_usuario);

        return res.status(200).json({
            success: true,
            message: 'Servicios cargados correctamente',
            data: servicios
        });
    } catch (error) {
        next(error);
    }
}

export async function getEstudiantesPorServicio(req: Request, res: Response, next: NextFunction) {
    try {
        const id_usuario = Number(req.params.idUsuario);
        const id_servicio = Number(req.params.idServicio);
        const estudiantes = await listarEstudiantesPorServicio(id_usuario, id_servicio);

        return res.status(200).json({
            success: true,
            message: 'Estudiantes del servicio cargados correctamente',
            data: estudiantes
        });
    } catch (error) {
        next(error);
    }
}

export async function getMesesEstudianteProveedor(req: Request, res: Response, next: NextFunction) {
    try {
        const id_usuario = Number(req.params.idUsuario);
        const id_servicio = Number(req.params.idServicio);
        const id_estudiante = Number(req.params.idEstudiante);
        const meses = await listarMesesEstudianteProveedor(id_usuario, id_servicio, id_estudiante);

        return res.status(200).json({
            success: true,
            message: 'Meses cargados correctamente',
            data: meses
        });
    } catch (error) {
        next(error);
    }
}