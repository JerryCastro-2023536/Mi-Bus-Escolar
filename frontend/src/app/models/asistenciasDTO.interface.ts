export type EstadoAbordaje = 'PENDIENTE' | 'PRESENTE' | 'AUSENTE' | 'NO ASISTIRA';
export type EstadoMarca = 'PRESENTE' | 'AUSENTE';

export type TipoNoti = 'INCIDENTE' | 'ASISTENCIA' | 'INASISTENCIA' | 'OTRO';

export interface MisRutaDTO {
    id_ruta: number;
    nombre: string;
    hora_inicio_estimada: string;   
    hora_fin_estimada: string;      
    total_estudiantes: number;      
    id_viaje_hoy: number | null;    
    reporte_completo: boolean; 
    presentes: number;
    ausentes: number;
}
export interface EstudianteRutaDTO {
    id_estudiante: number;
    nombre: string;
    apellido: string;
    grado: string;
    foto_estudiante?: string;               
    id_parada_recogida?: number | null;     
    id_parada_descenso?: number | null;     
}

export interface AsistenciaHoyDTO {
    id_estudiante: number;
    estado_abordaje: EstadoAbordaje;
    hora_abordaje?: string;         
}

export interface ReporteHoyDTO {
    id_viaje: number;
    id_chofer?: number;
    id_vehiculo?: number;
    fecha: string;                          
    asistencias: AsistenciaHoyDTO[];
}

export interface EnviarReporteDTO {
    id_viaje: number;
    asistencias: { id_estudiante: number; estado_abordaje: EstadoMarca }[];
}

export interface ReporteResultadoDTO {
    presentes: number;
    ausentes: number;
    notificaciones: number;                
}

export interface NotificacionDTO {
    id_notificacion?: number;               
    id_usuario?: number;
    id_incidencia?: number;
    id_asistencia?: number | null;
    tipo: TipoNoti;
    titulo: string;
    mensaje: string;
    leida: boolean;
    fecha_envio?: string | Date;                   
}
