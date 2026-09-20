import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/enviroment';
import { ActualizarVehiculoProveedor, NuevoVehiculoProveedor, VehiculoProveedor } from './../models/vehiculoProveedor.interface';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class VehiculosProveedorService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.API_URL}/vehiculos/proveedor`;

    listar(idUsuario: number): Observable<VehiculoProveedor[]> {
        return this.http
            .get<ApiResponse<VehiculoProveedor[]>>(`${this.baseUrl}/${idUsuario}`)
            .pipe(map(res => res.data));
    }

    /** Registra un vehículo nuevo para el proveedor logueado. La foto ya debe venir subida a Cloudinary. */
    registrar(idUsuario: number, vehiculo: NuevoVehiculoProveedor): Observable<VehiculoProveedor> {
        return this.http
            .post<ApiResponse<VehiculoProveedor>>(`${this.baseUrl}/${idUsuario}`, vehiculo)
            .pipe(map(res => res.data));
    }

    /** Edita los datos y/o el estado de un vehículo del proveedor. */
    actualizar(idUsuario: number, idVehiculo: number, vehiculo: ActualizarVehiculoProveedor): Observable<VehiculoProveedor> {
        return this.http
            .put<ApiResponse<VehiculoProveedor>>(`${this.baseUrl}/${idUsuario}/${idVehiculo}`, vehiculo)
            .pipe(map(res => res.data));
    }

    /** Elimina un vehículo del proveedor. */
    eliminar(idUsuario: number, idVehiculo: number): Observable<void> {
        return this.http
            .delete<ApiResponse<boolean>>(`${this.baseUrl}/${idUsuario}/${idVehiculo}`)
            .pipe(map(() => undefined));
    }
}
