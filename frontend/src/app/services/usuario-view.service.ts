import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { CrudService } from './crud.service';
import { EstudianteResumen } from '../models/pago.model';
import { ViajeUsuario } from '../models/viaje-usuario.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioViewService {

    private crudService = inject(CrudService);

    listarEstudiantesPorTutor(
        idUsuario: number
    ): Observable<EstudianteResumen[]> {

        return this.crudService
            .getAll<EstudianteResumen>(
                `/estudiantes/tutor/${idUsuario}`
            )
            .pipe(
                map(response => response.data ?? [])
            );
    }

    listarViajesActivosPorEstudiante(
        idEstudiante: number
    ): Observable<ViajeUsuario[]> {

        return this.crudService
            .getAll<ViajeUsuario>(
                `/viajes/estudiante/${idEstudiante}/activos`
            )
            .pipe(
                map(response => response.data ?? [])
            );
    }
}