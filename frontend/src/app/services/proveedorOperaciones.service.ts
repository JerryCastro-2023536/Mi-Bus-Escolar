import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/enviroments';
import {
    AsignacionRutaProveedor,
    EstudianteDisponible,
    IncidenciaProveedor,
    ProveedorChofer,
    ProveedorRutaResumen,
    ProveedorServicio,
    ProveedorUsuario,
    ProveedorVehiculo,
    ValoracionProveedor,
    ViajeProveedor,
} from '../models/proveedor-operaciones.model';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class ProveedorOperacionesService {
    private http = inject(HttpClient);
    private readonly base = `${environment.API_URL}/proveedor-operaciones`;

    private data<T>(request: Observable<ApiResponse<T>>): Observable<T> {
        return request.pipe(map((r) => r.data));
    }

    servicios(idUsuario: number) {
        return this.data(
            this.http.get<ApiResponse<ProveedorServicio[]>>(`${this.base}/${idUsuario}/servicios`),
        );
    }
    vehiculos(idUsuario: number) {
        return this.data(
            this.http.get<ApiResponse<ProveedorVehiculo[]>>(`${this.base}/${idUsuario}/vehiculos`),
        );
    }
    choferes(idUsuario: number) {
        return this.data(
            this.http.get<ApiResponse<ProveedorChofer[]>>(`${this.base}/${idUsuario}/choferes`),
        );
    }
    usuariosParaChofer(idUsuario: number, busqueda: string) {
        const params = new HttpParams().set('q', busqueda);
        return this.data(
            this.http.get<ApiResponse<ProveedorUsuario[]>>(`${this.base}/${idUsuario}/usuarios-chofer`, {
                params,
            }),
        );
    }
    crearChofer(idUsuario: number, idUsuarioChofer: number) {
        return this.data(
            this.http.post<ApiResponse<ProveedorChofer>>(`${this.base}/${idUsuario}/choferes`, {
                id_usuario: idUsuarioChofer,
            }),
        );
    }
    actualizarChofer(
        idUsuario: number,
        idChofer: number,
        data: { telefono_contacto: string; estado: string },
    ) {
        return this.data(
            this.http.put<ApiResponse<ProveedorChofer>>(
                `${this.base}/${idUsuario}/choferes/${idChofer}`,
                data,
            ),
        );
    }
    eliminarChofer(idUsuario: number, idChofer: number) {
        return this.data(
            this.http.delete<ApiResponse<boolean>>(`${this.base}/${idUsuario}/choferes/${idChofer}`),
        );
    }
    desasignarRutasChofer(idUsuario: number, idChofer: number, rutas: number[]) {
        return this.data(
            this.http.request<ApiResponse<boolean>>(
                'delete',
                `${this.base}/${idUsuario}/choferes/${idChofer}/rutas`,
                { body: { rutas } },
            ),
        );
    }

    rutas(idUsuario: number) {
        return this.data(
            this.http.get<ApiResponse<ProveedorRutaResumen[]>>(`${this.base}/${idUsuario}/rutas`),
        );
    }
    crearRuta(
        idUsuario: number,
        data: {
            id_servicio: number;
            nombre: string;
            hora_inicio_estimada: string | null;
            hora_fin_estimada: string | null;
        },
    ) {
        return this.data(
            this.http.post<ApiResponse<ProveedorRutaResumen>>(`${this.base}/${idUsuario}/rutas`, data),
        );
    }
    actualizarRuta(
        idUsuario: number,
        idRuta: number,
        data: {
            id_servicio: number;
            nombre: string;
            hora_inicio_estimada: string | null;
            hora_fin_estimada: string | null;
            estado?: string;
        },
    ) {
        return this.data(
            this.http.put<ApiResponse<ProveedorRutaResumen>>(
                `${this.base}/${idUsuario}/rutas/${idRuta}`,
                data,
            ),
        );
    }
    asignarChofer(idUsuario: number, idRuta: number, idChofer: number | null) {
        return this.data(
            this.http.put<ApiResponse<ProveedorRutaResumen>>(
                `${this.base}/${idUsuario}/rutas/${idRuta}/chofer`,
                { id_chofer: idChofer },
            ),
        );
    }
    asignarVehiculo(idUsuario: number, idRuta: number, idVehiculo: number | null) {
        return this.data(
            this.http.put<ApiResponse<ProveedorRutaResumen>>(
                `${this.base}/${idUsuario}/rutas/${idRuta}/vehiculo`,
                { id_vehiculo: idVehiculo },
            ),
        );
    }
    eliminarRuta(idUsuario: number, idRuta: number) {
        return this.data(
            this.http.delete<ApiResponse<boolean>>(`${this.base}/${idUsuario}/rutas/${idRuta}`),
        );
    }

    rutasParaAsignacion(idUsuario: number) {
        return this.rutas(idUsuario);
    }
    asignacionesRuta(idUsuario: number, idRuta: number) {
        return this.data(
            this.http.get<ApiResponse<AsignacionRutaProveedor[]>>(
                `${this.base}/${idUsuario}/rutas/${idRuta}/estudiantes`,
            ),
        );
    }
    buscarEstudiantes(idUsuario: number, idRuta: number, busqueda: string) {
        const params = new HttpParams().set('q', busqueda);
        return this.data(
            this.http.get<ApiResponse<EstudianteDisponible[]>>(
                `${this.base}/${idUsuario}/rutas/${idRuta}/estudiantes/buscar`,
                { params },
            ),
        );
    }
    asignarEstudiante(idUsuario: number, idRuta: number, idEstudiante: number) {
        return this.data(
            this.http.post<ApiResponse<AsignacionRutaProveedor>>(
                `${this.base}/${idUsuario}/rutas/${idRuta}/estudiantes`,
                { id_estudiante: idEstudiante },
            ),
        );
    }
    retirarEstudiante(idUsuario: number, idRuta: number, idAsignacion: number) {
        return this.data(
            this.http.delete<ApiResponse<boolean>>(
                `${this.base}/${idUsuario}/rutas/${idRuta}/estudiantes/${idAsignacion}`,
            ),
        );
    }

    incidencias(idUsuario: number) {
        return this.data(
            this.http.get<ApiResponse<IncidenciaProveedor[]>>(`${this.base}/${idUsuario}/incidencias`),
        );
    }
    viajes(idUsuario: number) {
        return this.data(
            this.http.get<ApiResponse<ViajeProveedor[]>>(`${this.base}/${idUsuario}/viajes`),
        );
    }
    valoraciones(idUsuario: number) {
        return this.data(
            this.http.get<ApiResponse<ValoracionProveedor[]>>(`${this.base}/${idUsuario}/valoraciones`),
        );
    }

    obtenerUbicacionActualViaje(idViaje: number) {
        return this.http.get<{ success: boolean; data: { latitud: number; longitud: number; fecha_hora?: string } }>(
            `${environment.API_URL}/viajes/${idViaje}/ubicacion-actual`
        ).pipe(
            map(res => res?.data || null)
        );
    }

    obtenerTrazadoRuta(idRuta: number) {
        return this.http.get<{ lat: number; lng: number }[]>(
            `${environment.API_URL}/rutas/${idRuta}/paradas`
        );
    }
}
