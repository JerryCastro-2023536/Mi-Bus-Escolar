import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/enviroments';
import { ApiResponse } from '../models/apiResponseDTO.interface';
import { EstudianteResumen, MesPago, RegistrarPagoPayload } from '../models/pago.model';

@Injectable({ providedIn: 'root' })
export class PagoService {
    private http = inject(HttpClient);
    private baseUrl = environment.API_URL;

    listarEstudiantesPorTutor(idUsuario: number): Observable<EstudianteResumen[]> {
        return this.http
            .get<ApiResponse<EstudianteResumen[]>>(`${this.baseUrl}/pagos/estudiantes/${idUsuario}`)
            .pipe(map(res => res.data ?? []));
    }

    listarMesesPendientes(idEstudiante: number): Observable<MesPago[]> {
        return this.http
            .get<ApiResponse<MesPago[]>>(`${this.baseUrl}/pagos/meses/${idEstudiante}`)
            .pipe(map(res => res.data ?? []));
    }

    buscarDetallePago(idEstudiante: number, idServicio: number, mes: number, anio: number): Observable<MesPago> {
        return this.http
            .get<ApiResponse<MesPago>>(`${this.baseUrl}/pagos/detalle/${idEstudiante}/${idServicio}/${mes}/${anio}`)
            .pipe(map(res => res.data as MesPago));
    }

    registrarPago(payload: RegistrarPagoPayload): Observable<MesPago> {
        return this.http
            .post<ApiResponse<MesPago>>(`${this.baseUrl}/pagos/registrar`, payload)
            .pipe(map(res => res.data as MesPago));
    }
}