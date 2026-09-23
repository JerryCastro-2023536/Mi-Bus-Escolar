export interface Valoraciones {
    id_valoracion: number;
    id_servicio: number;
    id_usuario: number;
    comentario: string | null;
    calificacion: number;
}

export interface ValoracionUsuarioPayload {
    comentario?: string | null;
    calificacion: number;
}
