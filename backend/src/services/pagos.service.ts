import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { ValidationError } from "../errors/validation.error";
import { Pagos, RegistrarPagoDTO } from "../models/Pagos";
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

export async function listarEstudiantesPorTutor(id_usuario_tutor: number) {
    try {
        const res = await pool.query('SELECT * FROM sp_estudiantes_por_tutor($1)', [id_usuario_tutor]);
        return res.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function listarMesesPendientes(id_estudiante: number) {
    try {
        const res = await pool.query('SELECT * FROM sp_pagos_meses_pendientes($1)', [id_estudiante]);
        return res.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarDetallePago(
    id_estudiante: number,
    id_servicio: number,
    periodo_mes: number,
    periodo_anio: number
) {
    try {
        const res = await pool.query(
            'SELECT * FROM sp_pagos_detalle($1, $2, $3, $4)',
            [id_estudiante, id_servicio, periodo_mes, periodo_anio]
        );

        if (!res.rows[0]) {
            throw new NotFoundError('No existe un pago registrado para ese periodo.');
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function registrarPago(payload: RegistrarPagoDTO) {
    try {
        const existente = await pool.query(
            'SELECT * FROM sp_pagos_detalle($1, $2, $3, $4)',
            [payload.id_estudiante, payload.id_servicio, payload.periodo_mes, payload.periodo_anio]
        );

        if (existente.rows[0]) {
            throw new ValidationError('Error al registrar el pago', [{
                campo: 'periodo',
                mensaje: 'Este periodo ya fue pagado.'
            }]);
        }

        const servicioRes = await pool.query(
            'SELECT precio_mensual FROM Servicios WHERE id_servicio = $1',
            [payload.id_servicio]
        );

        if (!servicioRes.rows[0]) {
            throw new NotFoundError('El servicio indicado no existe.');
        }

        const montoReal = servicioRes.rows[0].precio_mensual;

        const values = [
            payload.id_estudiante,           
            payload.id_servicio,             
            payload.periodo_mes,              
            payload.periodo_anio,             
            montoReal,                        
            payload.metodo_pago,              
            payload.referencia_pago ?? null,  
            payload.foto_comprobante ?? null  
        ];

        const res = await pool.query(
            'SELECT * FROM sp_pagos_registrar($1, $2, $3, $4, $5, $6, $7, $8)',
            values
        );

        const pago = res.rows[0];

        try {
            await notificarProveedor(payload.id_servicio, pago);
        } catch (error) {
            console.error('No se pudo crear la notificación del pago:', error);
        }

        return pago;
    } catch (error) {
        errorThrower(error);
    }
}

async function notificarProveedor(id_servicio: number, pago: any) {
    const proveedorRes = await pool.query(
        'SELECT * FROM sp_proveedor_usuario_por_servicio($1)',
        [id_servicio]
    );

    const proveedor = proveedorRes.rows[0];
    if (!proveedor) return;

    const nombreMes = new Date(pago.periodo_anio, pago.periodo_mes - 1)
        .toLocaleDateString('es-GT', { month: 'long', year: 'numeric' });

    await pool.query(
        'SELECT * FROM sp_notificaciones_agregarPago($1, $2, $3, $4, $5, $6)',
        [
            proveedor.id_usuario,
            null,
            null,
            'OTRO',
            'Nuevo pago registrado',
            `Se registró un pago de Q${pago.monto} correspondiente a ${nombreMes}.`
        ]
    );
}
