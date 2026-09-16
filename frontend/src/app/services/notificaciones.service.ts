import { Injectable, inject, signal, computed } from '@angular/core';
import { CrudService } from './crud.service';
import { Notificaciones } from '../../../../backend/src/models/Notificaciones';

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
    private crud = inject(CrudService);
    private endpoint = '/notificaciones';

    notificaciones = signal<Notificaciones[]>([]);

    noLeidasCount = computed(() =>
        this.notificaciones().filter(n => !n.leida).length
    );

    constructor() {
        this.cargar();
    }

    cargar(): void {
        this.crud.getAll<Notificaciones>(this.endpoint).subscribe({
            next: (data) => this.notificaciones.set(data || []),
            error: () => this.notificaciones.set([])
        });
    }

    marcarComoLeida(id?: number): void {
        if (id === undefined) return;
        const actual = this.notificaciones().find(n => n.id_notificaciones === id || (n as any).id_notificacion === id);
        
        this.notificaciones.update(lista =>
            lista.map(n => ((n.id_notificaciones === id || (n as any).id_notificacion === id) ? { ...n, leida: true } : n))
        );

        if (actual) {
            this.crud.update<Notificaciones>(this.endpoint, id, { ...actual, leida: true }).subscribe({
                error: () => this.cargar()
            });
        }
    }

    marcarTodasComoLeidas(): void {
        const pendientes = this.notificaciones().filter(n => !n.leida);
        this.notificaciones.update(lista => lista.map(n => ({ ...n, leida: true })));

        pendientes.forEach(n => {
            const id = n.id_notificaciones ?? (n as any).id_notificacion;
            if (id !== undefined) {
                this.crud.update<Notificaciones>(this.endpoint, id, { ...n, leida: true }).subscribe({
                    error: () => {}
                });
            }
        });
    }

    eliminarNotificacion(id?: number): void {
        if (id === undefined) return;
        const anterior = this.notificaciones();
        this.notificaciones.update(lista =>
            lista.filter(n => (n.id_notificaciones !== id && (n as any).id_notificacion !== id))
        );

        this.crud.delete(this.endpoint, id).subscribe({
            error: () => this.notificaciones.set(anterior)
        });
    }
}


