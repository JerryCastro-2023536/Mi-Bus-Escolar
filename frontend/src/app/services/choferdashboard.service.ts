import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/enviroment';
import { LoginService } from './login';

export interface EstudianteChoferDTO {
  id_estudiante: number;
  id_usuario_tutor?: number;
  nombre: string;
  apellido: string;
  grado?: string;
  colegio?: string;
  foto_estudiante?: string;
  ruta_asignada?: string;
  tutor_nombre?: string;
  tutor_telefono?: string;
}

export interface VehiculoChoferDTO {
  id_vehiculo: number;
  placa: string;
  foto_vehiculo?: string;
  estado: string;
  proveedor?: string;
  ruta_asignada?: string;
}

export interface ReporteChoferDTO {
  id_incidencia: number;
  titulo: string;
  descripcion?: string;
  estado: string;
  fecha_hora: string | Date;
  latitud?: number;
  longitud?: number;
  ruta?: string;
}

export interface RutaChoferDTO {
  id_ruta: number;
  nombre: string;
  hora_inicio_estimada?: string;
  hora_fin_estimada?: string;
  estado: string;
  servicio_nombre?: string;
  vehiculo_placa?: string;
  total_estudiantes?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChoferDashboardService {
  private http = inject(HttpClient);
  private loginService = inject(LoginService);
  private apiUrl = environment.API_URL;

 
  resolverIdChofer(): Observable<number> {
    const user = this.loginService.getUser();
    if (user?.id_chofer) {
      return of(Number(user.id_chofer));
    }

    const userId = user?.id_usuario || user?.id;
    if (!userId) {
      return of(1);
    }

    return this.http.get<any>(`${this.apiUrl}/chofer/usuario/${userId}`).pipe(
      map(res => {
        const idChofer = Number(res?.id_chofer ?? res?.data?.id_chofer ?? 1);
        if (user) {
          this.loginService.saveUser({ ...user, id_chofer: idChofer });
        }
        return idChofer;
      }),
      catchError(() => of(1))
    );
  }

  getEstudiantes(idChofer: number): Observable<EstudianteChoferDTO[]> {
    const headers = this.loginService.getAuthHeaders();
    return this.http.get<{ success: boolean; data: EstudianteChoferDTO[] }>(
      `${this.apiUrl}/chofer-dashboard/${idChofer}/estudiantes`,
      { headers }
    ).pipe(
      map(res => Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])),
      catchError(err => {
        console.error('Error cargando estudiantes del chofer:', err);
        return of([]);
      })
    );
  }

  getVehiculos(idChofer: number): Observable<VehiculoChoferDTO[]> {
    const headers = this.loginService.getAuthHeaders();
    return this.http.get<{ success: boolean; data: VehiculoChoferDTO[] }>(
      `${this.apiUrl}/chofer-dashboard/${idChofer}/vehiculos`,
      { headers }
    ).pipe(
      map(res => Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])),
      catchError(err => {
        console.error('Error cargando vehículos del chofer:', err);
        return of([]);
      })
    );
  }

  getReportes(idChofer: number): Observable<ReporteChoferDTO[]> {
    const headers = this.loginService.getAuthHeaders();
    return this.http.get<{ success: boolean; data: ReporteChoferDTO[] }>(
      `${this.apiUrl}/chofer-dashboard/${idChofer}/reportes`,
      { headers }
    ).pipe(
      map(res => Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])),
      catchError(err => {
        console.error('Error cargando reportes del chofer:', err);
        return of([]);
      })
    );
  }

  getRutas(idChofer: number): Observable<RutaChoferDTO[]> {
    const headers = this.loginService.getAuthHeaders();
    return this.http.get<{ success: boolean; data: RutaChoferDTO[] }>(
      `${this.apiUrl}/chofer-dashboard/${idChofer}/rutas`,
      { headers }
    ).pipe(
      map(res => Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])),
      catchError(err => {
        console.error('Error cargando rutas del chofer:', err);
        return of([]);
      })
    );
  }
}
