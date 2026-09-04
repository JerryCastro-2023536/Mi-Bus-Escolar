export interface UbicacionesBus{
    id_ubicacion?: number;
    id_viaje: number;
    latitud: number;
    longitud: number;
    velocidad: number | null;
    fecha_hora?: Date;
}