import { TipoNoti } from "../enums/TipoNoti";

export interface Notificaciones{
    id_notificaciones : number,
    id_usuario : number,
    id_incidencia : number,
    id_asistencia : number,
    tipo : TipoNoti,
    titulo : string,
    mensaje : string,
    leida : number,
    fecha_envio : Date
}