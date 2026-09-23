import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, catchError } from 'rxjs';

import { CrudService } from './crud.service';
import { EstudianteResumen } from '../models/pago.model';
import { ViajeUsuario } from '../models/viaje-usuario.model';
import { PuntoRuta } from '../models/mapas.type';
import { environment } from '../../environments/enviroments';

export interface AsignacionEstudiante {
    id_asignacion: number;
    id_estudiante: number;
    id_ruta: number;
    id_parada_recogida: number | null;
    id_parada_descenso: number | null;
}

export interface ParadaCreada {
    id_parada: number;
    nombre: string;
    direccion: string;
    latitud: number;
    longitud: number;
}

@Injectable({
    providedIn: 'root'
})
export class UsuarioViewService {

    private crudService = inject(CrudService);
    private http = inject(HttpClient);

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

    obtenerUbicacionActualViaje(idViaje: number) {
        return this.http.get<{ success: boolean; data: { latitud: number; longitud: number; fecha_hora?: string } }>(
            `${environment.API_URL}/viajes/${idViaje}/ubicacion-actual`
        ).pipe(
            map(res => res?.data || null)
        );
    }

    obtenerTrazadoRuta(idRuta: number): Observable<PuntoRuta[]> {
        return this.http.get<PuntoRuta[]>(
            `${environment.API_URL}/rutas/${idRuta}/paradas`
        );
    }

    obtenerTrazadoActivoViaje(idViaje: number, idRuta?: number | null): Observable<PuntoRuta[]> {
        const url = idRuta
            ? `${environment.API_URL}/viajes/${idViaje}/trazado-activo?idRuta=${idRuta}`
            : `${environment.API_URL}/viajes/${idViaje}/trazado-activo`;
        return this.http.get<PuntoRuta[]>(url).pipe(
            catchError(() => of([]))
        );
    }

    obtenerAsignacionEstudiante(
        idEstudiante: number
    ): Observable<AsignacionEstudiante | null> {
        return this.http
            .get<{ success: boolean; data: AsignacionEstudiante[] }>(
                `${environment.API_URL}/asignaciones`
            )
            .pipe(
                map(res => {
                    const lista = res?.data ?? [];
                    return lista.find(
                        a => Number(a.id_estudiante) === Number(idEstudiante)
                    ) ?? null;
                }),
                catchError(() => of(null))
            );
    }

    actualizarAsignacion(
        idAsignacion: number,
        payload: {
            id_estudiante: number;
            id_ruta: number;
            id_parada_recogida: number | null;
            id_parada_descenso: number | null;
        }
    ): Observable<any> {
        return this.http.put(
            `${environment.API_URL}/asignaciones/${idAsignacion}`,
            payload
        );
    }

    crearParada(payload: {
        nombre: string;
        direccion: string;
        latitud: number;
        longitud: number;
    }): Observable<ParadaCreada> {
        return this.http.post<{ success: boolean; message: string; data: ParadaCreada }>(
            `${environment.API_URL}/paradas`,
            payload
        ).pipe(
            map(res => res.data)
        );
    }

    editarParada(
        idParada: number,
        payload: {
            nombre: string;
            direccion: string;
            latitud: number;
            longitud: number;
        }
    ): Observable<any> {
        return this.http.put<{ success: boolean; message: string; data: any }>(
            `${environment.API_URL}/paradas/${idParada}`,
            payload
        ).pipe(
            map(res => res.data)
        );
    }

    agregarParadaARuta(payload: {
        id_ruta: number;
        id_parada: number;
        orden_parada: number;
    }): Observable<any> {
        return this.http.post(
            `${environment.API_URL}/ruta-parada`,
            payload
        );
    }

    listarTodasParadas(): Observable<any[]> {
        return this.http
            .get<{ success: boolean; data: any[] }>(`${environment.API_URL}/paradas`)
            .pipe(
                map(res => res?.data ?? []),
                catchError(() => of([]))
            );
    }

    obtenerParadasDeRuta(idRuta: number): Observable<any[]> {
        return forkJoin({
            rutaParadas: this.http.get<{ success: boolean; data: any[] }>(`${environment.API_URL}/ruta-parada`),
            todasParadas: this.http.get<{ success: boolean; data: any[] }>(`${environment.API_URL}/paradas`)
        }).pipe(
            map(({ rutaParadas, todasParadas }) => {
                const rpList = (rutaParadas?.data ?? []).filter(
                    (rp: any) => Number(rp.id_ruta) === Number(idRuta)
                );
                const paradasMap = new Map<number, any>(
                    (todasParadas?.data ?? []).map((p: any) => [Number(p.id_parada), p])
                );

                return rpList.map((rp: any) => {
                    const detalle = paradasMap.get(Number(rp.id_parada));
                    return {
                        ...rp,
                        nombre: detalle?.nombre || `Parada #${rp.id_parada}`,
                        direccion: detalle?.direccion || '',
                        latitud: detalle?.latitud != null ? Number(detalle.latitud) : null,
                        longitud: detalle?.longitud != null ? Number(detalle.longitud) : null
                    };
                });
            }),
            catchError(() => of([]))
        );
    }
}