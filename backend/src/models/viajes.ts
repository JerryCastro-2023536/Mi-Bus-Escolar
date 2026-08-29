import { estadoViajes } from "../enums/estadoViajes";

export interface Viajes{
    id_viaje: number;
    id_ruta: number;
    id_chofer: number;
    id_vehiculo: number;
    fecha_viaje: Date;
    hora_inicio: Date;
    hora_fin: Date;
    estado: estadoViajes;
}