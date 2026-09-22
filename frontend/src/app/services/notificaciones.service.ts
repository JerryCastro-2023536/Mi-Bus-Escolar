import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { forkJoin, of, Observable, throwError } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { CrudService } from './crud.service';
import { NotificacionesDTO } from '../models/notificacionesDTO.interface';
import { ApiResponse } from '../models/apiResponseDTO.interface';
import { LoginService } from './login';

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
    private crud = inject(CrudService);
    private loginService = inject(LoginService);
    private endpoint = '/notificaciones'; 
    private endpointMias = '/notificaciones/mias';

    notificaciones = signal<NotificacionesDTO[]>([]);
    cargando = signal(false);
    error = signal<string | null>(null);
    private solicitudActual = 0;
    private idUsuarioActual: number | null = null;

    noLeidasCount = computed(() =>
        this.notificaciones().filter(n => !n.leida).length
    );

    constructor() {
        effect(() => {
            const usuario = this.loginService.user();
            const idUsuario = Number(usuario?.id_usuario ?? usuario?.id);

            if (idUsuario === this.idUsuarioActual) return;

            this.idUsuarioActual = Number.isInteger(idUsuario) && idUsuario > 0
                ? idUsuario
                : null;
            this.notificaciones.set([]);
            this.error.set(null);

            if (this.idUsuarioActual !== null) {
                this.cargar();
            }
        });
    }

    private putLeida(n: NotificacionesDTO): Observable<ApiResponse<NotificacionesDTO>> {
        const id = n.id_notificaciones;
        if (id === undefined) {
            return throwError(() => new Error('La notificación no tiene un identificador válido.'));
        }

        return this.crud.getById<any>(this.endpoint, id).pipe(
            switchMap((res) => {
                if (!res.success || !res.data) {
                    return throwError(() => new Error('No se pudo obtener la notificación.'));
                }

                const data = res.data;
                const payload = {
                    id_usuario: data.id_usuario,
                    tipo: data.tipo,
                    titulo: data.titulo,
                    mensaje: data.mensaje,
                    leida: true,
                    fecha_envio: data.fecha_envio
                };
                return this.crud.update<NotificacionesDTO>(this.endpoint, id, payload);
            })
        );
    }

    cargar(): void {
        this.cargando.set(true);
        this.error.set(null);

        const usuario = this.loginService.getUser();
        const idUsuario = Number(usuario?.id_usuario ?? usuario?.id);
        const solicitud = ++this.solicitudActual;

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            this.cargando.set(false);
            this.notificaciones.set([]);
            this.error.set('No se pudo identificar al usuario para cargar sus notificaciones.');
            return;
        }

        this.crud.getAll<NotificacionesDTO>(this.endpointMias)
            .pipe(finalize(() => {
                if (solicitud === this.solicitudActual) {
                    this.cargando.set(false);
                }
            }))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        const lista = (res.data ?? []).map((n: any) => ({
                            ...n,
                            id_notificaciones: n.id_notificaciones ?? n.id_notificacion
                        })) as NotificacionesDTO[];
                        if (solicitud === this.solicitudActual && idUsuario === this.idUsuarioActual) {
                            this.notificaciones.set(lista);
                        }
                    } else {
                        if (solicitud === this.solicitudActual && idUsuario === this.idUsuarioActual) {
                            this.notificaciones.set([]);
                            this.error.set('No se pudieron cargar las notificaciones.');
                        }
                    }
                },
                error: () => {
                    if (solicitud === this.solicitudActual && idUsuario === this.idUsuarioActual) {
                        this.notificaciones.set([]);
                        this.error.set('No se pudieron cargar las notificaciones.');
                    }
                }
            });
    }

    marcarComoLeida(id?: number): void {
        if (id === undefined) return;

        const actual = this.notificaciones().find(n => n.id_notificaciones === id);
        if (!actual || actual.leida) return;

        this.setLeida([id], true);

        const revertir = () => {
            this.setLeida([id], false);
            this.error.set('No se pudo marcar la notificación como leída.');
        };

        this.putLeida(actual).subscribe({
            next: (res: any) => {
                const ok = res.success || res.sucess;
                if (!ok) revertir();
            },
            error: () => revertir()
        });
    }

    marcarTodasComoLeidas(): void {
        const pendientes = this.notificaciones()
            .filter(n => !n.leida && n.id_notificaciones !== undefined);
        if (pendientes.length === 0) return;

        this.setLeida(pendientes.map(n => n.id_notificaciones!), true);

        forkJoin(
            pendientes.map(n =>
                this.putLeida(n).pipe(
                    map((res: any) => ({ id: n.id_notificaciones!, ok: !!(res.success || res.sucess) })),
                    catchError(() => of({ id: n.id_notificaciones!, ok: false }))
                )
            )
        ).subscribe((resultados) => {
            const fallidas = resultados.filter(r => !r.ok).map(r => r.id);
            if (fallidas.length > 0) {
                this.setLeida(fallidas, false);
                this.error.set(`No se pudieron marcar ${fallidas.length} notificación(es) como leída(s).`);
            }
        });
    }

    eliminarNotificacion(id?: number): void {
        if (id === undefined) return;

        this.notificaciones.update(lista => lista.filter(n => n.id_notificaciones !== id));

        const fallo = () => {
            this.error.set('No se pudo eliminar la notificación.');
            this.cargar();
        };

        this.crud.delete(this.endpoint, id).subscribe({
            next: (res: any) => {
                const ok = res.success || res.sucess;
                if (!ok) fallo();
            },
            error: () => fallo()
        });
    }

    limpiarError(): void {
        this.error.set(null);
    }

    private setLeida(ids: number[], leida: boolean): void {
        const set = new Set(ids);
        this.notificaciones.update(lista =>
            lista.map(n =>
                n.id_notificaciones !== undefined && set.has(n.id_notificaciones)
                    ? { ...n, leida }
                    : n
            )
        );
    }
}