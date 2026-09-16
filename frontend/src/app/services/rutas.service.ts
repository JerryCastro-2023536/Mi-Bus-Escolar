import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PuntoRuta } from '../models/mapas.type';
import { Incidencias } from '../models/incidencias';

@Injectable({ providedIn: 'root' })
export class rutasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  obtenerViajeDia(idChofer: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/viajes/hoy/${idChofer}`);
  }

  obtenerTrazadoRuta(idRuta: number): Observable<PuntoRuta[]> {
    return this.http.get<PuntoRuta[]>(`${this.apiUrl}/rutas/${idRuta}/paradas`);
  }

  iniciarRutaViaje(idChoferOViaje: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/viajes/iniciar/${idChoferOViaje}`, {
      idChofer: idChoferOViaje
    });
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
}