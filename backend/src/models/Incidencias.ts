import {Estados} from "./EstadosActivosInactivos"
 
export interface Incidencias{
    id_incidencia: number,
    id_viaje: number,
    id_ruta: number,
    id_usuario_reporta: number,
    titulo: string,
    descripcion: string,
    latitud: number,
    longitud: number,
    fecha_hora: Date,
    estado: Estados
}