import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { CrudService } from './crud.service';
import { NotificacionesDTO } from '../models/notificacionesDTO.interface';
import { ApiResponse } from '../models/apiResponseDTO.interface';

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
    private crud = inject(CrudService);
    private endpoint = '/notificaciones'; // CrudService ya agrega API_URL

    notificaciones = signal<NotificacionesDTO[]>([]);
    cargando = signal(false);
    error = signal<string | null>(null);

    noLeidasCount = computed(() =>
        this.notificaciones().filter(n => !n.leida).length
    );

    constructor() {
        this.cargar();
    }

    private putLeida(n: NotificacionesDTO): Observable<ApiResponse<NotificacionesDTO>> {
        const { id_notificaciones, ...resto } = n as any;
        return this.crud.update<NotificacionesDTO>(this.endpoint, id_notificaciones, {
            ...resto,
            leida: true
        });
    }

    cargar(): void {
        if (this.cargando()) return;

        this.cargando.set(true);
        this.error.set(null);

        this.crud.getAll<NotificacionesDTO>(this.endpoint)
            .pipe(finalize(() => this.cargando.set(false)))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        const lista = (res.data ?? []).map((n: any) => ({
                            ...n,
                            id_notificaciones: n.id_notificaciones ?? n.id_notificacion
                        })) as NotificacionesDTO[];
                        this.notificaciones.set(lista);
                    } else {
                        this.notificaciones.set([]);
                        this.error.set('No se pudieron cargar las notificaciones.');
                    }
                },
                error: () => {
                    this.notificaciones.set([]);
                    this.error.set('No se pudieron cargar las notificaciones.');
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
            next: (res) => { if (!res.success) revertir(); },
            error: () => revertir()
        });
    }

    marcarTodasComoLeidas(): void {
        const pendientes = this.notificaciones()
            .filter(n => !n.leida && n.id_notificaciones !== undefined);
        if (pendientes.length === 0) return;

        this.setLeida(pendientes.map(n => n.id_notificaciones!), true); // optimista

        forkJoin(
            pendientes.map(n =>
                this.putLeida(n).pipe(
                    map(res => ({ id: n.id_notificaciones!, ok: res.success })),
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
            next: (res) => { if (!res.success) fallo(); },
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
