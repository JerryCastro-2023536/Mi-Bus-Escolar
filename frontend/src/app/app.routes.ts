import { crudRoutes } from './shared/crud.routes';
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';


export const routes: Routes = [
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

            ...crudRoutes,
        ],
    },

    { path: '**', redirectTo: 'login' },
];