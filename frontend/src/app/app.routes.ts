import { crudRoutes } from './shared/crud.routes';
import { Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa.component';
import { ChoferDashboardComponents } from './components/mapa-chofer/chofer-dashboard.components';
import { DashboardChoferComponents } from './components/dashboard-chofer/dashboard-chofer.components';
import { authGuard, guestGuard, dashboardRedirectGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: "mapa", 
        component: MapaComponent
    },

    { path: '', redirectTo: 'login', pathMatch: 'full' },

    {
        path: 'login',
        title: 'Iniciar sesión | MiBusEscolar',
        canActivate: [guestGuard],
        loadComponent: () => import('./components/login/login').then(m => m.Login),
    },

    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./components/dashboard-layout/dashboard-layout').then(m => m.DashboardComponent),
        children: [
            {
                path: 'dashboard',
                canActivate: [dashboardRedirectGuard],
                // El guard redirige siempre; este componente es un placeholder
                loadComponent: () => import('./components/login/login').then(m => m.Login),
            },
            {
                path: 'dashboard-administrador',
                title: 'Administrador | MiBusEscolar',
                loadComponent: () => import('./components/admin-view/admin-view').then(m => m.AdminView),
            },
            {
                path: 'cuenta',
                title: 'Mi Cuenta | MiBusEscolar',
                loadComponent: () => import('./components/cuenta-view/cuenta-view').then(m => m.CuentaView),
                data: {
                    title: 'Centro de Cuenta & Perfil',
                    subtitle: 'Gestiona tu información personal, credenciales de acceso y visualiza los permisos de tu rol.'
                }
            },
            {
                path: 'notificaciones',
                title: 'Notificaciones | MiBusEscolar',
                loadComponent: () => import('./components/notificaciones/notificaciones').then(m => m.Notificaciones),
                data: {
                    title: 'Bandeja de Notificaciones',
                    subtitle: 'Centro de avisos, alertas de ruta, asistencias e incidencias según tu rol en el sistema.'
                }
            },
            {
                path: "dashboard-chofer",
                title: "Dashboard Chofer | MiBusEscolar",
                loadComponent: () => import('./components/dashboard-chofer/dashboard-chofer.components').then(d => d.DashboardChoferComponents),
                data: {
                    title: "Gestión de acciones del Chofer",
                    subtitle: "Administracion de Rutas, Estudiantes, Buses y Reportes del chofer asignado."
                }
            },
            {
                path: "ruta-chofer",
                title: "Ruta Chofer | MiBusEscolar",
                loadComponent: () => import('./components/mapa-chofer/chofer-dashboard.components').then(d => d.ChoferDashboardComponents),
                data: {
                    title: "Gestión de Rutas del chofer",
                    subtitle: "Ver las rutas, tomar asistencias, iniciar viaje, anotar abordaje y finalizar ruta."
                }
            },

            ...crudRoutes,
        ],
    },

    { path: '**', redirectTo: 'login' },
];
