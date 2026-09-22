import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, catchError } from 'rxjs';

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
                `/viajes/estudiante/${idEstudiante}`
            )
            .pipe(
                map(response => response.data ?? [])
            );
    }

    listarTodosViajesPorEstudiante(
        idEstudiante: number
    ): Observable<ViajeUsuario[]> {
        return forkJoin({
            viajesRes: this.crudService.getAll<any>('/viajes').pipe(catchError(() => of({ data: [] }))),
            asignacionesRes: this.crudService.getAll<any>('/asignaciones').pipe(catchError(() => of({ data: [] }))),
            rutasRes: this.crudService.getAll<any>('/rutas').pipe(catchError(() => of({ data: [] }))),
            activosRes: this.crudService.getAll<any>(`/viajes/estudiante/${idEstudiante}`).pipe(catchError(() => of({ data: [] })))
        }).pipe(
            map(({ viajesRes, asignacionesRes, rutasRes, activosRes }) => {
                const asignaciones = asignacionesRes.data ?? [];
                const rutasEstudiante = new Set(
                    asignaciones
                        .filter((a: any) => Number(a.id_estudiante) === Number(idEstudiante))
                        .map((a: any) => Number(a.id_ruta))
                );

                const rutasMap = new Map<number, string>();
                (rutasRes.data ?? []).forEach((r: any) => {
                    if (r.id_ruta && r.nombre) {
                        rutasMap.set(Number(r.id_ruta), r.nombre);
                    }
                });

                const activosFromSp = (activosRes.data ?? []) as ViajeUsuario[];
                const activosMap = new Map<number, ViajeUsuario>();
                activosFromSp.forEach(v => activosMap.set(v.id_viaje, v));

                const todosViajes = (viajesRes.data ?? [])
                    .filter((v: any) => rutasEstudiante.size === 0 || rutasEstudiante.has(Number(v.id_ruta)))
                    .map((v: any) => {
                        const id = Number(v.id_viaje);
                        if (activosMap.has(id)) {
                            return activosMap.get(id)!;
                        }
                        return {
                            ...v,
                            id_viaje: id,
                            id_ruta: Number(v.id_ruta),
                            id_chofer: v.id_chofer ? Number(v.id_chofer) : null,
                            id_vehiculo: v.id_vehiculo ? Number(v.id_vehiculo) : null,
                            fecha_viaje: v.fecha_viaje,
                            hora_inicio: v.hora_inicio,
                            hora_fin: v.hora_fin,
                            estado: v.estado,
                            nombre_ruta: rutasMap.get(Number(v.id_ruta)) || `Ruta #${v.id_ruta}`
                        } as ViajeUsuario;
                    });

                activosFromSp.forEach(v => {
                    if (!todosViajes.some(t => t.id_viaje === v.id_viaje)) {
                        todosViajes.push(v);
                    }
                });

                return todosViajes;
            })
        );
    }
}