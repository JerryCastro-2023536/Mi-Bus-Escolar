import { EstadoPago } from "../enums/EstadoPago";

export interface Pagos {
    id_pago?: number,
    id_estudiante: number,
    id_servicio: number,
    periodo_mes: number,
    periodo_anio: number,
    monto: number,
    metodo_pago: string,
    referencia_pago: string,
    foto_comprobante: string,
    estado: EstadoPago,
    fecha_pago_limite: Date,
    fecha_verificacion: Date,
    verificado_por: number,
    observaciones: string
}

export interface EstudianteResumenDTO {
    id_estudiante: number;
    nombre: string;
    apellido: string;
    foto_estudiante: string | null;
    grado: string | null;
    nombre_colegio: string | null;
}

export interface MesPagoDTO {
    periodo_mes: number;
    periodo_anio: number;
    precio_mensual: number;
    estado: 'PENDIENTE' | 'PAGADO' | 'CANCELADO';
    id_pago: number | null;
    fecha_pago_limite: string | null;
    fecha_verificacion: string | null;
    foto_comprobante: string | null;
    metodo_pago: string | null;
    referencia_pago: string | null;
}

export interface PagoDetalleDTO {
    id_pago: number;
    id_estudiante: number;
    id_servicio: number;
    periodo_mes: number;
    periodo_anio: number;
    monto: number;
    metodo_pago: string;
    referencia_pago: string;
    foto_comprobante: string | null;
    estado: string;
    fecha_pago_limite: string | null;
    fecha_verificacion: string | null;
    observaciones: string | null;
    nombre_estudiante: string;
    nombre_servicio: string;
}

export interface RegistrarPagoDTO {
    id_estudiante: number;
    periodo_mes: number;
    periodo_anio: number;
    metodo_pago: string;
    referencia_pago: string;
    foto_comprobante: string;
}