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
  ====================================== */

  obtenerValoraciones():
    Observable<ApiResponse<Valoracion[]>> {

    return this.http.get<
      ApiResponse<Valoracion[]>
    >(
      `${this.apiUrl}/valoraciones`
    );

  }

}