import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


/* ========================================
   VALORACIÓN
======================================== */

export interface Valoracion {

  id_valoracion: number;

  id_proveedor: number;

  comentario: string;

  calificacion: number;

}


/* ========================================
   VALORACIÓN CON DATOS DEL USUARIO
   NUEVO
======================================== */

export interface ValoracionDetalle extends Valoracion {

  id_usuario: number | null;

  nombre_usuario: string | null;

  apellido_usuario: string | null;

}


/* ========================================
   RESPUESTA DEL BACKEND
======================================== */

export interface ApiResponse<T> {

  success: boolean;

  message: string;

  data: T;

}


@Injectable({
  providedIn: 'root'
})
export class ValoracionesService {


  /* ======================================
     URL DEL BACKEND
  ====================================== */

  private readonly apiUrl =
    'http://localhost:3000/api';


  constructor(
    private http: HttpClient
  ) {}


  /* ======================================
     VALORACIONES PÚBLICAS
     EXISTENTE - NO TOCAR
  ====================================== */

  obtenerValoraciones():
    Observable<ApiResponse<Valoracion[]>> {

    return this.http.get<
      ApiResponse<Valoracion[]>
    >(
      `${this.apiUrl}/landing/valoraciones`
    );

  }


  /* ======================================
     VALORACIONES CON USUARIO
     NUEVO
  ====================================== */

  obtenerValoracionesDetalle():
    Observable<ApiResponse<ValoracionDetalle[]>> {

    return this.http.get<
      ApiResponse<ValoracionDetalle[]>
    >(
      `${this.apiUrl}/valoraciones/detalle`
    );

  }

}