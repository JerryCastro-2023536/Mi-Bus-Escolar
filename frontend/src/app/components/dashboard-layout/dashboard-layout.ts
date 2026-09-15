import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';
import { LoginService } from '../../services/login';
import { miBusEscolarBrand, miBusEscolarSidebarConfig } from '../../config/sidebar-nav.config';

interface DashboardKpi {
    label: string;
    value: string;
    icon: string;
    trend?: string;
    trendUp?: boolean;
}

interface ViajeResumen {
    ruta: string;
    chofer: string;
    hora: string;
    estado: 'PROGRAMADO' | 'ACTIVO' | 'FINALIZADO';
}

interface ActividadReciente {
    icon: string;
    texto: string;
    tiempo: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
    templateUrl: './dashboard-layout.html',
    styleUrl: './dashboard-layout.css'
})
export class DashboardComponent {
    private loginService = inject(LoginService);
    private router = inject(Router);

    brand = miBusEscolarBrand;
    sections = miBusEscolarSidebarConfig;

    get sidebarUser() {
        const u = this.loginService.getUser();
        return u ? { name: u.nombre ?? u.name ?? 'Usuario', role: u.rol } : null;
    }

    onLogout(): void {
        this.loginService.logout();
        this.router.navigateByUrl('/login');
    }

    kpis = signal<DashboardKpi[]>([
        { label: 'Estudiantes activos', value: '342', icon: 'graduation-cap', trend: '+12 este mes', trendUp: true },
        { label: 'Rutas en operación', value: '18', icon: 'route', trend: '2 nuevas', trendUp: true },
        { label: 'Viajes de hoy', value: '46', icon: 'map', trend: '9 en curso', trendUp: true },
        { label: 'Pagos pendientes', value: 'Q 12,450', icon: 'credit-card', trend: '7 vencidos', trendUp: false }
    ]);

    proximosViajes = signal<ViajeResumen[]>([
        { ruta: 'Ruta Norte - Zona 7', chofer: 'Carlos Méndez', hora: '06:30 AM', estado: 'ACTIVO' },
        { ruta: 'Ruta Sur - Villa Nueva', chofer: 'Ana Pérez', hora: '06:45 AM', estado: 'PROGRAMADO' },
        { ruta: 'Ruta Centro - Zona 1', chofer: 'Luis García', hora: '07:00 AM', estado: 'PROGRAMADO' },
        { ruta: 'Ruta Este - Zona 18', chofer: 'María López', hora: '07:15 AM', estado: 'FINALIZADO' }
    ]);

    actividad = signal<ActividadReciente[]>([
        { icon: 'user-plus', texto: 'Se registró un nuevo estudiante en Colegio San José', tiempo: 'Hace 10 min' },
        { icon: 'credit-card', texto: 'Pago confirmado — Servicio mensual de transporte', tiempo: 'Hace 32 min' },
        { icon: 'triangle-exclamation', texto: 'Nueva incidencia reportada en Ruta Norte', tiempo: 'Hace 1 h' },
        { icon: 'bell', texto: 'Notificación enviada a 24 padres de familia', tiempo: 'Hace 2 h' }
    ]);
}
