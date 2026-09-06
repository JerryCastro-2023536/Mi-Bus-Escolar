import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Pagos } from "../models/Pagos";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarPagos() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_pagos_listar()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarPagoById(id: number) {
    try {
        const res = await pool.query("SELECT * FROM sp_pagos_buscar_por_id($1)", [id]);

        if (!res.rows[0]) {
            throw new NotFoundError(`El pago con ID ${id} no fue encontrado.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarPago(p: Pagos) {
    try {
        const values = [
            p.id_estudiante, p.id_servicio, p.periodo_mes, p.periodo_anio, p.monto,
            p.metodo_pago, p.referencia_pago, p.foto_comprobante, p.estado,
            p.fecha_pago_limite, p.fecha_verificacion, p.verificado_por, p.observaciones
        ];
        const query = "SELECT * FROM sp_pagos_agregar($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarPagoById(id: number, p: Pagos) {
    try {
        const values = [
            p.id_estudiante, p.id_servicio, p.periodo_mes, p.periodo_anio, p.monto,
            p.metodo_pago, p.referencia_pago, p.foto_comprobante, p.estado,
            p.fecha_pago_limite, p.fecha_verificacion, p.verificado_por, p.observaciones, id
        ];
        const query = "SELECT * FROM sp_pagos_actualizar($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)";
        const res = await pool.query(query, values);

        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: El pago con ID ${id} no existe.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarPagoById(id: number) {
    try {
        const res = await pool.query("SELECT sp_pagos_eliminar($1) AS filas_afectadas", [id]);

        if (res.rows[0].filas_afectadas === 0) {
            throw new NotFoundError(`No se puede eliminar: El pago con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}
