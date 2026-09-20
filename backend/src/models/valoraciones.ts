export interface Valoraciones {
    id_valoracion: number;
    id_proveedor: number;
    id_usuario: number | null;
    comentario: string | null;
    calificacion: number;
}
