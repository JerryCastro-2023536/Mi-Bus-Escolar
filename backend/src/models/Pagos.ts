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

export interface MesPagoDTO {
    id_servicio: number;
    nombre_servicio: string;
    precio_mensual: number;
    periodo_mes: number;
    periodo_anio: number;
    id_pago: number | null;
    estado: EstadoPago;
    monto: number | null;
    metodo_pago: string | null;
    referencia_pago: string | null;
    foto_comprobante: string | null;
    fecha_pago_limite: Date | null;
    fecha_verificacion: Date | null;
}

export interface RegistrarPagoDTO {
    id_estudiante: number;
    id_servicio: number;
    periodo_mes: number;
    periodo_anio: number;
    metodo_pago: string;
    referencia_pago?: string | null;
    foto_comprobante?: string | null;
}