export interface ViajeUsuario {
    id_viaje: number;
    id_ruta: number;
    id_chofer: number | null;
    id_vehiculo: number | null;

    fecha_viaje: string;
    hora_inicio: string | null;
    hora_fin: string | null;

    estado: 'PROGRAMADO' | 'ACTIVO' | 'FINALIZADO';

    nombre_ruta?: string;
    nombre_chofer?: string;
    apellido_chofer?: string;
    placa_vehiculo?: string;
}