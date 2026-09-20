export interface ProveedorRutaPayload {
    id_servicio: number;
    nombre: string;
    hora_inicio_estimada?: string | null;
    hora_fin_estimada?: string | null;
    estado?: string;
}