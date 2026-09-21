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
   SERVICIO
======================================== */

export interface Servicio {

  id_servicio: number;

  id_proveedor: number;

  nombre: string;

  descripcion: string;

  precio_mensual: number;

  estado: string;

  fecha_creacion: string | Date;

}


/* ========================================
   PROVEEDOR
======================================== */

export interface Proveedor {

  id_proveedor: number;

  id_usuario: number;

  nombre_negocio: string;

  direccion: string;

  telefono_contacto: string;

}


/* ========================================
   RUTA
======================================== */

export interface Ruta {

  id_ruta: number;

  id_servicio: number;

  id_vehiculo: number;

  id_chofer: number;

  nombre: string;

  hora_inicio_estimada: string | Date;

  hora_fin_estimada: string | Date;

  estado: string;

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
export class ServiciosService {


  /* ======================================
     URL DEL BACKEND
  ====================================== */

  private readonly apiUrl =
    'http://localhost:3000/api';


  constructor(
    private http: HttpClient
  ) {}


  /* ======================================
     SERVICIOS PÚBLICOS
  ====================================== */

  obtenerServicios():
    Observable<ApiResponse<Servicio[]>> {

    return this.http.get<
      ApiResponse<Servicio[]>
    >(
      `${this.apiUrl}/servicios`
    );

  }


  /* ======================================
     PROVEEDORES PÚBLICOS
  ====================================== */

  obtenerProveedores():
    Observable<ApiResponse<Proveedor[]>> {

    return this.http.get<
      ApiResponse<Proveedor[]>
    >(
      `${this.apiUrl}/proveedores`
    );

  }


  /* ======================================
     RUTAS PÚBLICAS
  ====================================== */

  obtenerRutas():
    Observable<ApiResponse<Ruta[]>> {

    return this.http.get<
      ApiResponse<Ruta[]>
    >(
      `${this.apiUrl}/rutas`
    );

  }

}