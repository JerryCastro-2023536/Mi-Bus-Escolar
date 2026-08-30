import { EstadoPago } from "../enums/EstadoPago";

export interface Pagos{
    id_pago? : number,
    id_estudiante : number,
    id_servicio : number,
    periodo_mes : number,
    periodo_anio : number,
    monto : number,
    metodo_pago : string,
    referencia_pago : string,
    foto_comprobante : string,
    estado : EstadoPago,
    fecha_pago_limite : Date,
    fecha_verificacion : Date,
    verificado_por : number,
    observaciones : string
}