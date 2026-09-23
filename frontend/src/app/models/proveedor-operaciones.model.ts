export interface ProveedorUsuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo?: string;
  telefono?: string;
  foto_usuario?: string | null;
  rol: string;
}

export interface ProveedorServicio {
  id_servicio: number;
  nombre: string;
  descripcion?: string | null;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface ProveedorVehiculo {
  id_vehiculo: number;
  placa: string;
  foto_vehiculo?: string | null;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface ProveedorChofer {
  id_chofer: number;
  id_usuario: number;
  nombre: string;
  apellido: string;
  foto_usuario?: string | null;
  telefono_contacto: string;
  estado: 'ACTIVO' | 'INACTIVO';
  rutas: ProveedorRutaResumen[];
}

export interface ProveedorRutaResumen {
  id_ruta: number;
  id_servicio: number;
  nombre_servicio: string;
  id_vehiculo: number | null;
  placa_vehiculo: string | null;
  id_chofer: number | null;
  nombre_chofer: string | null;
  apellido_chofer: string | null;
  nombre: string;
  hora_inicio_estimada: string | null;
  hora_fin_estimada: string | null;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface AsignacionRutaProveedor {
  id_asignacion: number;
  id_estudiante: number;
  id_ruta: number;
  nombre_estudiante: string;
  apellido_estudiante: string;
  grado: string | null;
  foto_estudiante: string | null;
  direccion_parada_recogida: string | null;
  direccion_parada_descenso: string | null;
}

export interface EstudianteDisponible {
  id_estudiante: number;
  nombre: string;
  apellido: string;
  grado: string | null;
  nombre_colegio: string | null;
  foto_estudiante: string | null;
}

export interface ViajeProveedor {
  id_viaje: number;
  id_ruta: number | null;
  nombre_ruta: string | null;
  nombre_chofer: string | null;
  apellido_chofer: string | null;
  placa_vehiculo: string | null;
  fecha_viaje: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  estado: 'PROGRAMADO' | 'ACTIVO' | 'FINALIZADO' | string;
}

export interface IncidenciaProveedor {
  id_incidencia: number;
  id_ruta: number;
  nombre_ruta: string;
  titulo: string;
  descripcion: string | null;
  fecha_hora: string;
  estado: 'ABIERTA' | 'CERRADA' | string;
}

export interface ValoracionProveedor {
  id_valoracion: number;
  id_servicio: number;
  nombre_servicio: string;
  id_usuario: number;
  nombre_usuario: string | null;
  apellido_usuario: string | null;
  foto_usuario: string | null;
  comentario: string | null;
  calificacion: number;
}
