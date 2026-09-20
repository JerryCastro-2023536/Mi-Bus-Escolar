export type EstadoVehiculo = 'ACTIVO' | 'INACTIVO';

/** Vehículo del proveedor, con la ruta/servicio/chofer al que está asignado (si aplica). */
export interface VehiculoProveedor {
    id_vehiculo: number;
    placa: string;
    foto_vehiculo: string | null;
    estado: EstadoVehiculo;

    id_ruta: number | null;
    nombre_ruta: string | null;
    id_servicio: number | null;
    nombre_servicio: string | null;
    id_chofer: number | null;
    nombre_chofer: string | null;
    apellido_chofer: string | null;
}

/** Datos que envía el proveedor al registrar un vehículo (id_proveedor lo resuelve el backend). */
export interface NuevoVehiculoProveedor {
    placa: string;
    foto_vehiculo: string | null;
}

/** Datos para editar un vehículo: los mismos del alta más el estado. */
export interface ActualizarVehiculoProveedor extends NuevoVehiculoProveedor {
    estado: EstadoVehiculo;
}
