import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroment';

export interface Valoracion {
  id_valoracion: number;
  id_servicio: number;
  id_usuario: number | null;
  comentario: string | null;
  calificacion: number;
}

export interface ValoracionDetalle extends Valoracion {
  nombre_servicio: string;
  nombre_usuario: string | null;
  apellido_usuario: string | null;
  foto_usuario: string | null;
}

export interface CrearValoracionServicio {
  comentario: string | null;
  calificacion: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ValoracionesService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.API_URL;

  obtenerValoraciones(): Observable<ApiResponse<Valoracion[]>> {
    return this.http.get<ApiResponse<Valoracion[]>>(
      `${this.apiUrl}/landing/valoraciones`,
    );
  }

  obtenerValoracionesDetalle(): Observable<ApiResponse<ValoracionDetalle[]>> {
    return this.http.get<ApiResponse<ValoracionDetalle[]>>(
      `${this.apiUrl}/landing/valoracionesDetalle`,
    );
  }

  valorarServicio(
    idServicio: number,
    payload: CrearValoracionServicio,
  ): Observable<ApiResponse<Valoracion>> {
    return this.http.post<ApiResponse<Valoracion>>(
      `${this.apiUrl}/valoraciones/servicio/${idServicio}`,
      payload,
    );
  }
}
