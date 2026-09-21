import { ServicioProveedor } from './../models/proveedores.model';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { EstudianteResumen, MesPago } from '../models/pago.model';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class PagoProveedorService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.API_URL}/pagos/proveedor/servicios`;

    /** Servicios del proveedor (recibe el id_usuario de la sesión). */
    listarServicios(idUsuario: number): Observable<ServicioProveedor[]> {
        return this.http
            .get<ApiResponse<ServicioProveedor[]>>(`${this.baseUrl}/${idUsuario}`)
            .pipe(map(res => res.data));
    }

    /** Estudiantes asignados a un servicio del proveedor. */
    listarEstudiantesPorServicio(idUsuario: number, idServicio: number): Observable<EstudianteResumen[]> {
        return this.http
            .get<ApiResponse<EstudianteResumen[]>>(`${this.baseUrl}/${idUsuario}/${idServicio}/estudiantes`)
            .pipe(map(res => res.data));
    }

    /** Meses de pago de un estudiante dentro de un servicio. */
    listarMesesEstudiante(idUsuario: number, idServicio: number, idEstudiante: number): Observable<MesPago[]> {
        return this.http
            .get<ApiResponse<MesPago[]>>(`${this.baseUrl}/${idUsuario}/${idServicio}/estudiantes/${idEstudiante}/meses`)
            .pipe(map(res => res.data));
    }
}