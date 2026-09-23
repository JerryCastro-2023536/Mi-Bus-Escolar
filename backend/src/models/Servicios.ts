import {Estados} from "../enums/EstadosActivosInactivos"

export interface Servicios{
    id_servicio?: number,
    id_proveedor: number,
    nombre: string,
    descripcion: string,
    precio_mensual: number,
    estado: Estados,
    fecha_creacion: Date
}