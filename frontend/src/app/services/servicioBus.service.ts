import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActualizarServicioBus, NuevoServicioBus, ServicioBus } from '../models/servicioBus.interface';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class ServicioBusService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.API_URL}/servicios/proveedor`;

    listar(idUsuario: number): Observable<ServicioBus[]> {
        return this.http
            .get<ApiResponse<ServicioBus[]>>(`${this.baseUrl}/${idUsuario}`)
            .pipe(map(res => res.data));
    }

    /** Registra un servicio nuevo para el proveedor logueado. */
    registrar(idUsuario: number, servicio: NuevoServicioBus): Observable<ServicioBus> {
        return this.http
            .post<ApiResponse<ServicioBus>>(`${this.baseUrl}/${idUsuario}`, servicio)
            .pipe(map(res => res.data));
    }

    /** Edita los datos y/o el estado de un servicio del proveedor. */
    actualizar(idUsuario: number, idServicio: number, servicio: ActualizarServicioBus): Observable<ServicioBus> {
        return this.http
            .put<ApiResponse<ServicioBus>>(`${this.baseUrl}/${idUsuario}/${idServicio}`, servicio)
            .pipe(map(res => res.data));
    }

    /** Elimina un servicio (el backend lo rechaza si tiene rutas o pagos). */
    eliminar(idUsuario: number, idServicio: number): Observable<void> {
        return this.http
            .delete<ApiResponse<boolean>>(`${this.baseUrl}/${idUsuario}/${idServicio}`)
            .pipe(map(() => undefined));
    }
}