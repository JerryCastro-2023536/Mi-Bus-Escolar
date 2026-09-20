export type EstadoServicioBus = 'ACTIVO' | 'INACTIVO';

/** Servicio de bus del proveedor, con sus conteos de rutas y estudiantes. */
export interface ServicioBus {
    id_servicio: number;
    nombre: string;
    descripcion: string | null;
    precio_mensual: number;
    estado: EstadoServicioBus;
    fecha_creacion: string;
    total_rutas: number;
    total_estudiantes: number;
}

/** Datos que envía el proveedor al registrar un servicio (el id_proveedor lo resuelve el backend). */
export interface NuevoServicioBus {
    nombre: string;
    descripcion: string | null;
    precio_mensual: number;
}

/** Datos para editar un servicio: los mismos del alta más el estado. */
export interface ActualizarServicioBus extends NuevoServicioBus {
    estado: EstadoServicioBus;
}