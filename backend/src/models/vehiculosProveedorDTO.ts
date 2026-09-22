export type EstadoVehiculo = 'ACTIVO' | 'INACTIVO';

// Lo que envía el proveedor al registrar un vehículo nuevo.
export interface NuevoVehiculoProveedorDTO {
    placa: string;
    foto_vehiculo: string | null;
}

// Datos para editar un vehículo: los mismos del alta más el estado. 
export interface ActualizarVehiculoProveedorDTO extends NuevoVehiculoProveedorDTO {
    estado: EstadoVehiculo;
}
