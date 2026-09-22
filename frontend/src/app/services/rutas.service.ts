import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { PuntoRuta } from '../models/mapas.type';
import { Incidencias } from '../models/incidencias';
import { environment } from '../../environments/enviroments';
import { NotificacionDTO } from '../models/asistenciasDTO.interface';

export interface EstudianteAsistenciaDTO {
  id_estudiante: number;
  id_usuario_tutor?: number;
  nombre: string;
  apellido: string;
  grado: string;
  foto_estudiante?: string;
  estado_abordaje: 'PENDIENTE' | 'PRESENTE' | 'AUSENTE';
  hora_abordaje?: string;
  estado_descenso?: string;
  hora_descenso?: string;
  id_viaje?: number;
  marcaLocal?: 'PRESENTE' | 'AUSENTE';
}

@Injectable({ providedIn: 'root' })
export class rutasService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  resolverChofer(idUsuario: number): Observable<{ id_chofer: number } | null> {
    return this.http.get<{ id_chofer: number }>(`${this.apiUrl}/chofer/usuario/${idUsuario}`).pipe(
      timeout(8000),
      catchError(() => of(null))
    );
  }

  obtenerProveedorChofer(idChofer: number): Observable<{ id_proveedor: number; id_usuario_proveedor: number } | null> {
    return this.http.get<{ success: boolean; data: { id_proveedor: number; id_usuario_proveedor: number } }>(`${this.apiUrl}/choferes/${idChofer}/proveedor`).pipe(
      timeout(8000),
      map(res => res.data),
      catchError(() => of(null))
    );
  }

  obtenerViajeDia(idChofer: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/viajes/hoy/${idChofer}`).pipe(
      timeout(8000),
      catchError(() => of(null))
    );
  }

  obtenerTrazadoRuta(idRuta: number): Observable<PuntoRuta[]> {
    return this.http.get<PuntoRuta[]>(`${this.apiUrl}/rutas/${idRuta}/paradas`).pipe(
      timeout(8000),
      catchError(() => of([]))
    );
  }

  obtenerTrazadoAsistencia(idRuta: number, idViaje: number, tipo: 'IDA' | 'VUELTA'): Observable<PuntoRuta[]> {
    return this.http.get<PuntoRuta[]>(`${this.apiUrl}/rutas/${idRuta}/paradas-asistencia/${idViaje}?tipo=${tipo}`).pipe(
      timeout(8000),
      catchError(() => of([]))
    );
  }

  iniciarRutaViaje(idChofer: number, tipo: 'IDA' | 'VUELTA' = 'IDA'): Observable<any> {
    return this.http.post(`${this.apiUrl}/viajes/iniciar/${idChofer}`, { idChofer, tipo });
  }

  registrarUbicacionBus(idViaje: number, ubicacion: PuntoRuta): Observable<any> {
    return this.http.post(`${this.apiUrl}/ubicaciones`, {
      id_viaje: idViaje,
      latitud: ubicacion.lat,
      longitud: ubicacion.lng
    });
  }

  finalizarRutaViaje(idViaje: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/viajes/${idViaje}/finalizar`, { id_viaje: idViaje });
  }

  obtenerEstudiantesAsistencia(idChofer: number, idViaje?: number): Observable<EstudianteAsistenciaDTO[]> {
    const url = idViaje
      ? `${this.apiUrl}/viajes/chofer/${idChofer}/estudiantes?idViaje=${idViaje}`
      : `${this.apiUrl}/viajes/chofer/${idChofer}/estudiantes`;
    return this.http.get<{ success: boolean; data: EstudianteAsistenciaDTO[] }>(url).pipe(
      map(r => r.data),
      catchError(() => of([]))
    );
  }

  marcarAbordaje(idViaje: number, idEstudiante: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/viajes/${idViaje}/abordaje/${idEstudiante}`, undefined);
  }

  marcarDescenso(idViaje: number, idEstudiante: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/viajes/${idViaje}/descenso/${idEstudiante}`, undefined);
  }

  marcarAusente(idViaje: number, idEstudiante: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/viajes/${idViaje}/ausente/${idEstudiante}`, undefined);
  }

  enviarReporte(reporte: Incidencias): Observable<any> {
    return this.http.post(`${this.apiUrl}/incidencias`, {
      id_viaje: reporte.id_viaje,
      id_ruta: reporte.id_ruta,
      id_usuario_reporta: reporte.id_usuario_reporta,
      titulo: reporte.titulo,
      descripcion: reporte.descripcion,
      latitud: reporte.latitud,
      longitud: reporte.longitud,
      fecha_hora: reporte.fecha_hora,
      estado: reporte.estado
    });
  }

  enviarNotificacion(notificacion: NotificacionDTO): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/notificaciones`,
      notificacion
    );
  }

}


