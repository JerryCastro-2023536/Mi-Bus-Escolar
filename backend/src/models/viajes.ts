import { estadoViajes } from "../enums/estadoViajes";

export interface Viajes{
    id_viaje?: number;
    id_ruta: number | null;
    id_chofer: number | null;
    id_vehiculo: number | null;
    fecha_viaje: Date;
    hora_inicio: Date | null;
    hora_fin: Date | null;
    estado: estadoViajes;
}