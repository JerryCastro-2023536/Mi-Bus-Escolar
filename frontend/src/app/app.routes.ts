import { PagosProveedorView } from './components/pagos-proveedor-view/pagos-proveedor-view';
import { crudRoutes } from './shared/crud.routes';
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { roleGuard, dashboardRedirectGuard } from './core/guards/role.guard';

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
            // /dashboard → redirige al dashboard del rol del usuario
            { path: 'dashboard', canActivate: [dashboardRedirectGuard], children: [] },

            {
                path: 'dashboard/admin',
                title: 'Administrador | MiBusEscolar',
                canActivate: [roleGuard],
                data: { roles: ['ADMINISTRADOR'] },
                loadComponent: () => import('./components/admin-view/admin-view').then(m => m.AdminView),
            },
            {
                path: 'dashboard/proveedor',
                title: 'Proveedor | MiBusEscolar',
                canActivate: [roleGuard],
                data: { roles: ['PROVEEDOR'] },
                loadComponent: () => import('../app/components/pagos-proveedor-view/pagos-proveedor-view').then(m => m.PagosProveedorView),
            },/*
            {
                path: 'dashboard/chofer',
                title: 'Chofer | MiBusEscolar',
                canActivate: [roleGuard],
                data: { roles: ['CHOFER'] },
                loadComponent: () => import('./components/chofer-view/chofer-view').then(m => m.ChoferView),
            },*/
            {
                path: 'dashboard/usuario',
                title: 'Mi Panel | MiBusEscolar',
                canActivate: [roleGuard],
                data: { roles: ['USUARIO'] },
                loadComponent: () => import('../app/components/pagos-view/pagos-view').then(m => m.PagosView),
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
                path: 'pagosUser',
                title: 'Mis Pagos | MiBusEscolar',
                canActivate: [roleGuard],
                loadComponent: () => import('./components/pagos-view/pagos-view').then(m => m.PagosView),
                data: {
                    roles: ['USUARIO'],
                    title: 'Mis Pagos',
                    subtitle: 'Consulta y realiza los pagos del transporte escolar de tus hijos.'
                }
            },
            {
                path: 'mis-servicios',
                title: 'Mis Servicios | MiBusEscolar',
                canActivate: [roleGuard],
                loadComponent: () => import('./components/mis-servicios-view/mis-servicios-view').then(m => m.MisServiciosView),
                data: {
                    roles: ['PROVEEDOR'],
                    title: 'Mis Servicios',
                    subtitle: 'Consulta, agrega y edita tus servicios asignados.'
                }
            },

            {
                path: 'mis-vehiculos',
                title: 'Mis Vehículos | MiBusEscolar',
                canActivate: [roleGuard],
                loadComponent: () => import('./components/vehiculos-proveedor-view/vehiculos-proveedor-view').then(m => m.VehiculosProveedorView),
                data: {
                    roles: ['PROVEEDOR'],
                    title: 'Mis Vehículos',
                    subtitle: 'Administra tu flota, sube fotos y consulta a qué ruta y chofer está asignado cada vehículo.'
                }
            },

            ...crudRoutes,
        ],
    },

    { path: '**', redirectTo: 'login' },
];