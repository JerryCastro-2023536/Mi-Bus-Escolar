import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface NotificacionItem {
    id_notificacion: number;
    id_usuario: number;
    id_incidencia: number | null;
    id_asistencia: number | null;
    tipo: 'INCIDENTE' | 'ASISTENCIA' | 'INASISTENCIA' | 'OTRO';
    titulo: string;
    mensaje: string;
    leida: boolean;
    fecha_envio: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/notificaciones';

    notificaciones = signal<NotificacionItem[]>([]);

    noLeidasCount = computed(() =>
        this.notificaciones().filter(n => !n.leida).length
    );

    constructor() {
        this.cargar();
    }

    cargar(): void {
        this.http.get<ApiResponse<NotificacionItem[]>>(`${this.apiUrl}/mias`).subscribe({
            next: (res) => this.notificaciones.set(res.data),
            error: () => this.notificaciones.set([])
        });
    }

    marcarComoLeida(id: number): void {
        this.notificaciones.update(lista =>
            lista.map(n => n.id_notificacion === id ? { ...n, leida: true } : n)
        );

        this.http.patch(`${this.apiUrl}/${id}/leida`, {}).subscribe({
            error: () => this.cargar()
        });
    }

    marcarTodasComoLeidas(): void {
        const pendientes = this.notificaciones().filter(n => !n.leida);
        this.notificaciones.update(lista => lista.map(n => ({ ...n, leida: true })));

        pendientes.forEach(n => {
            this.http.patch(`${this.apiUrl}/${n.id_notificacion}/leida`, {}).subscribe({
                error: () => {}
            });
        });
    }

    eliminarNotificacion(id: number): void {
        const anterior = this.notificaciones();
        this.notificaciones.update(lista => lista.filter(n => n.id_notificacion !== id));

        this.http.delete(`${this.apiUrl}/${id}`).subscribe({
            error: () => this.notificaciones.set(anterior)
        });
    }
}
