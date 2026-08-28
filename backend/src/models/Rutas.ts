import {Estados} from "./EstadosActivosInactivos"

export interface Rutas{
    id_ruta: number,
    id_servicio: number,
    id_vehiculo: number,
    id_chofer: number,
    nombre: string,
    hora_inicio_estimada: Date,
    hora_fin_estimada: Date,
    estado: Estados
}