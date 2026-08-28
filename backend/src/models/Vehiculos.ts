import {Estados} from "./EstadosActivosInactivos"

export interface Vehiculos{
    id_vehiculo: number,
    id_proveedor: number,
    placa: string,
    foto_vehiculo: string,
    estado: Estados 
}