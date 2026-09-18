import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Notificaciones as NotificacionItem } from '../../../../../backend/src/models/Notificaciones';
import { LoginService } from '../../services/login';
import { HeaderComponent } from '../dashboard-layout/header/header';
import { SidebarComponent } from '../dashboard-layout/sidebar/sidebar';
import { SidebarUser } from '../../models/sidebar.model';
import { TiempoRelativoPipe } from '../../shared/pipes/tiempoRelativo.pipe';
import { NotificacionEstiloPipe } from '../../shared/pipes/notificacionEstilo.pipe';

@Component({
    selector: 'app-notificaciones',
    standalone: true,
    imports: [
        CommonModule, FormsModule,TiempoRelativoPipe, NotificacionEstiloPipe
    ],
    templateUrl: './notificaciones.html',
    styleUrl: './notificaciones.css'
})
export class Notificaciones {
    notifService = inject(NotificacionesService);
    loginService = inject(LoginService);

    filtroActual: string = 'TODAS';
    busqueda: string = '';

    get sidebarUser(): SidebarUser | null {
        const user = this.loginService.getUser();
        if (!user) return null;
        return {
            name: user.nombre || user.name || 'Usuario',
            role: user.rol || 'USUARIO'
        };
    }

    get notificacionesFiltradas(): NotificacionItem[] {
        const lista = this.notifService.notificaciones();
        const texto = this.busqueda.trim().toLowerCase();

        return lista.filter(item => {
            let pasaFiltro = true;
            if (this.filtroActual === 'NO_LEIDAS') {
                pasaFiltro = !item.leida;
            } else if (this.filtroActual !== 'TODAS') {
                pasaFiltro = item.tipo === this.filtroActual;
            }

            if (pasaFiltro && texto) {
                pasaFiltro =
                    item.titulo.toLowerCase().includes(texto) ||
                    item.mensaje.toLowerCase().includes(texto);
            }

            return pasaFiltro;
        });
    }

    contarPorFiltro(filtro: string): number {
        const lista = this.notifService.notificaciones();
        if (filtro === 'TODAS') return lista.length;
        if (filtro === 'NO_LEIDAS') return lista.filter(n => !n.leida).length;
        return lista.filter(n => n.tipo === filtro).length;
    }

    cambiarFiltro(nuevoFiltro: string): void {
        this.filtroActual = nuevoFiltro;
    }

    marcarComoLeida(id?: number): void {
        if (id !== undefined) {
            this.notifService.marcarComoLeida(id);
        }
    }

    marcarTodasComoLeidas(): void {
        this.notifService.marcarTodasComoLeidas();
    }

    eliminar(id?: number): void {
        if (id !== undefined) {
            this.notifService.eliminarNotificacion(id);
        }
    }
}
