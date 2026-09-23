export type EstadoServicio = 'ACTIVO' | 'INACTIVO';

export interface NuevoServicioProveedorDTO {
    nombre: string;
    descripcion?: string | null;
    precio_mensual: number;
}

export interface ActualizarServicioProveedorDTO extends NuevoServicioProveedorDTO {
    estado: EstadoServicio;
}