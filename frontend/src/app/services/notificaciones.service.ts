import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CrudService } from './crud.service';
import { NotificacionesDTO } from '../models/notificacionesDTO.interface';

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
    private crud = inject(CrudService);
    private endpoint = '/notificaciones';

    notificaciones = signal<NotificacionesDTO[]>([]);

    noLeidasCount = computed(() =>
        this.notificaciones().filter(n => !n.leida).length
    );

    constructor() {
        this.cargar();
    }

    cargar(): void {
        this.crud.getAll<NotificacionesDTO>(this.endpoint).subscribe({
            next: (res) => this.notificaciones.set(res.success ? (res.data ?? []) : []),
            error: () => this.notificaciones.set([])
        });
    }

    marcarComoLeida(id?: number): void {
        if (id === undefined) return;

        const anterior = this.notificaciones();
        const actual = anterior.find(n => n.id_notificaciones === id);
        if (!actual || actual.leida) return;

        // Actualización optimista
        this.notificaciones.update(lista =>
            lista.map(n => n.id_notificaciones === id ? { ...n, leida: true } : n)
        );

        this.crud.update<NotificacionesDTO>(this.endpoint, id, { ...actual, leida: true }).subscribe({
            next: (res) => { if (!res.success) this.notificaciones.set(anterior); },
            error: () => this.notificaciones.set(anterior)
        });
    }

    marcarTodasComoLeidas(): void {
        const pendientes = this.notificaciones()
            .filter(n => !n.leida && n.id_notificaciones !== undefined);
        if (pendientes.length === 0) return;

        // Actualización optimista
        this.notificaciones.update(lista => lista.map(n => ({ ...n, leida: true })));

        forkJoin(
            pendientes.map(n =>
                this.crud.update<NotificacionesDTO>(this.endpoint, n.id_notificaciones!, { ...n, leida: true })
            )
        ).subscribe({
            // Si alguna falló, se recarga desde el servidor para quedar sincronizados
            next: (respuestas) => { if (respuestas.some(r => !r.success)) this.cargar(); },
            error: () => this.cargar()
        });
    }

    eliminarNotificacion(id?: number): void {
        if (id === undefined) return;

        const anterior = this.notificaciones();
        this.notificaciones.update(lista => lista.filter(n => n.id_notificaciones !== id));

        this.crud.delete(this.endpoint, id).subscribe({
            next: (res) => { if (!res.success) this.notificaciones.set(anterior); },
            error: () => this.notificaciones.set(anterior)
        });
    }
}