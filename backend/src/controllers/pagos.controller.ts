import { Request, Response, NextFunction } from "express";

import { Pagos } from "../models/Pagos";
import { actualizarPago, agregarPagos, buscarPagoPorId, eliminarPago, listarPagos } from "../services/pagos.service";

export async function getPagos(req: Request, res: Response, next: NextFunction){
    try{
        const datos = await listarPagos();
        return res.status(200).json({
            success: true,
            message: "Pagos cargados",
            data: datos
        });
    }catch(error){
        next(error)
    }
}

export async function postPagos(req: Request, res: Response, next: NextFunction) {
    const { id_estudiante, id_servicio, periodo_mes, periodo_anio, monto, metodo_pago, referencia_pago, foto_comprobante, estado, fecha_pago_limite, fecha_verificacion, verificado_por, observaciones } = req.body
    const nuevoPago : Pagos = { id_estudiante, id_servicio, periodo_mes, periodo_anio, monto, metodo_pago, referencia_pago, foto_comprobante, estado, fecha_pago_limite, fecha_verificacion, verificado_por, observaciones } 
    const pagoCreado = await agregarPagos(nuevoPago);
    try{
        return res.status(201).json({
            success: true,
            message: "Pago creado",
            data: pagoCreado
        });
    }catch(error){
        next(error);
    }
}

export async function getPagoById(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const pagoEncontrado = await buscarPagoPorId(id);
        return res.status(200).json({
            success: true,
            message: `Pago con id: ${id} encontrado`,
            data: pagoEncontrado
        });
    }catch(error){
        next(error);
    }
}

export async function putPago(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const { id_estudiante, id_servicio, periodo_mes, periodo_anio, monto, metodo_pago, referencia_pago, foto_comprobante, estado, fecha_pago_limite, fecha_verificacion, verificado_por, observaciones } = req.body;
        const pagoActualizar : Pagos = { id_estudiante, id_servicio, periodo_mes, periodo_anio, monto, metodo_pago, referencia_pago, foto_comprobante, estado, fecha_pago_limite, fecha_verificacion, verificado_por, observaciones }
        const pagoEditado = await actualizarPago(pagoActualizar, id);

        return res.status(200).json({
            success: true,
            message: "Pago editado",
            data: pagoEditado
        })
    }catch(error){
        next(error);
    }
}

export async function deletePago(req: Request, res: Response, next: NextFunction){
    try{
        const id = Number(req.params.id);
        const resultado = await eliminarPago(id);
         
        return res.status(200).json({
            sucess: true,
            message: "Pago eliminado",
            data: resultado
        })
    }catch(error){
        next(error);
    }
}
