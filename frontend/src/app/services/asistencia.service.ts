import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    MisRutaDTO,
    EstudianteRutaDTO,
    ReporteHoyDTO,
    EnviarReporteDTO,
    ReporteResultadoDTO,
    NotificacionDTO,
} from '../models/asistenciasDTO.interface';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/apiResponseDTO.interface';

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
    private http = inject(HttpClient);
    private baseUrl = environment.API_URL;

    getMisRutas(): Observable<ApiResponse<MisRutaDTO[]>> {
        return this.http.get<ApiResponse<MisRutaDTO[]>>(`${this.baseUrl}/asistencia/mis-rutas`);
    }

    getEstudiantesRuta(idRuta: number): Observable<ApiResponse<EstudianteRutaDTO[]>> {
        return this.http.get<ApiResponse<EstudianteRutaDTO[]>>(
            `${this.baseUrl}/asistencia/rutas/${idRuta}/estudiantes`
        );
    }

    getReporteHoy(idRuta: number): Observable<ApiResponse<ReporteHoyDTO>> {
        return this.http.get<ApiResponse<ReporteHoyDTO>>(
            `${this.baseUrl}/asistencia/rutas/${idRuta}/reporte-hoy`
        );
    }
    enviarReporte(reporte: EnviarReporteDTO): Observable<ApiResponse<ReporteResultadoDTO>> {
        return this.http.post<ApiResponse<ReporteResultadoDTO>>(
            `${this.baseUrl}/asistencia/reporte`,
            reporte
        );
    }

    getNotificaciones(): Observable<ApiResponse<NotificacionDTO[]>> {
        return this.http.get<ApiResponse<NotificacionDTO[]>>(`${this.baseUrl}/notificaciones/mias`);
    }

    contarNoLeidas(): Observable<ApiResponse<number>> {
        return this.http.get<ApiResponse<number>>(`${this.baseUrl}/notificaciones/no-leidas`);
    }

    marcarLeida(idNotificacion: number): Observable<ApiResponse<void>> {
        return this.http.patch<ApiResponse<void>>(
            `${this.baseUrl}/notificaciones/${idNotificacion}/leida`,
            {}
        );
    }
}
