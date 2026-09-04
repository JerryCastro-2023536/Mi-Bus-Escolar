import { EstadoAbordaje } from "../enums/estadoAbordaje";

export interface Asistencias {
    id_asistencia: number,
    id_viaje: number,
    id_estudiante: number,
    estado_abordaje: string,
    hora_abordaje: Date,
    estado_descenso: string,
    hora_descenso: Date
}