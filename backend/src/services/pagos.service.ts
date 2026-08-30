import { pool } from "../config/Conexion";
import { Pagos } from "../models/Pagos";

export async function listarPagos() {
    const resultado = await pool.query("SELECT * FROM pagos");
    return resultado.rows;
}

export async function agregarPagos(p_pagos : Pagos){
    const valores = [p_pagos.id_estudiante, p_pagos.id_servicio, p_pagos.periodo_mes, p_pagos.periodo_anio, p_pagos.monto, p_pagos.metodo_pago, p_pagos.referencia_pago, p_pagos.foto_comprobante, p_pagos.estado, p_pagos.fecha_pago_limite, p_pagos.fecha_verificacion, p_pagos.verificado_por, p_pagos.observaciones];
    const consulta = `INSERT INTO pagos(id_estudiante, id_servicio, periodo_mes, periodo_anio, monto, metodo_pago, referencia_pago, foto_comprobante, estado, fecha_pago_limite, fecha_verificacion, verificado_por, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function buscarPagoPorId(id : number){
    const valor = [id];
    const resultado = await pool.query("SELECT * FROM pagos WHERE id_pago = $1", valor);
    return resultado.rows[0];
}

export async function actualizarPago(p_pagos : Pagos, id: number){
    const valores = [p_pagos.id_estudiante, p_pagos.id_servicio, p_pagos.periodo_mes, p_pagos.periodo_anio, p_pagos.monto, p_pagos.metodo_pago, p_pagos.referencia_pago, p_pagos.foto_comprobante, p_pagos.estado, p_pagos.fecha_pago_limite, p_pagos.fecha_verificacion, p_pagos.verificado_por, p_pagos.observaciones, id];
    const consulta = `UPDATE pagos SET id_estudiante = $1, id_servicio = $2, periodo_mes = $3, periodo_anio = $4, monto = $5, metodo_pago = $6, referencia_pago = $7, foto_comprobante = $8, estado = $9, fecha_pago_limite = $10, fecha_verificacion = $11, verificado_por = $12, observaciones = $13 WHERE id_pago = $14`;
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function eliminarPago(id : number) {
    const valor = [id];
    const resultado = await pool.query("DELETE FROM pagos WHERE id_pago = $1", valor);
    console.log("Eliminado correctamente");
}
