export type EstadoVehiculo = 'ACTIVO' | 'INACTIVO';

export interface RutaVehiculo {
    id_ruta: number;
    nombre_ruta: string;
    id_servicio: number;
    nombre_servicio: string;
    id_chofer: number | null;
    nombre_chofer: string | null;
    apellido_chofer: string | null;
}

export interface VehiculoProveedor {
    id_vehiculo: number;
    id_proveedor: number;
    placa: string;
    foto_vehiculo: string | null;
    estado: EstadoVehiculo;
    rutas: RutaVehiculo[];
}

export interface NuevoVehiculoProveedor {
    placa: string;
    foto_vehiculo: string | null;
}

export interface ActualizarVehiculoProveedor {
    placa: string;
    foto_vehiculo: string | null;
    estado: EstadoVehiculo;
}