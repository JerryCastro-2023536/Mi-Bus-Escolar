import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { dashboardRedirectGuard } from './core/guards/role.guard';

import { crudRoutes } from './shared/crud.routes';
import { adminRoutes } from './shared/admin.routes';
import { proveedorRoutes } from './shared/proveedor.routes';
import { choferRoutes } from './shared/chofer.routes';
import { usuarioRoutes } from './shared/usuario.routes';
import { sharedRoutes } from './shared/shared.routes';

export const routes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },

    {
        path: 'login',
        title: 'Iniciar sesión | MiBusEscolar',
        canActivate: [guestGuard],
        loadComponent: () => import('./components/login/login').then(m => m.Login),
    },

    {
        path: 'error/404',
        title: 'Página no encontrada | MiBusEscolar',
        data: { code: 404 },
        loadComponent: () => import('./components/errors/errors').then(m => m.ErrorView),
    },
    {
        path: 'error/403',
        title: 'Acceso restringido | MiBusEscolar',
        data: { code: 403 },
        loadComponent: () => import('./components/errors/errors').then(m => m.ErrorView),
    },
    {
        path: 'error/401',
        title: 'Sesión expirada | MiBusEscolar',
        data: { code: 401 },
        loadComponent: () => import('./components/errors/errors').then(m => m.ErrorView),
    },
    {
        path: 'error/500',
        title: 'Error del servidor | MiBusEscolar',
        data: { code: 500 },
        loadComponent: () => import('./components/errors/errors').then(m => m.ErrorView),
    },
    {
        path: 'error/503',
        title: 'En mantenimiento | MiBusEscolar',
        data: { code: 503 },
        loadComponent: () => import('./components/errors/errors').then(m => m.ErrorView),
    },
    {
        path: 'error/sin-conexion',
        title: 'Sin conexión | MiBusEscolar',
        data: { code: 0 },
        loadComponent: () => import('./components/errors/errors').then(m => m.ErrorView),
    },
    {
        path: 'landing',
        title: ' Landing Page| MiBusEscolar',
        loadComponent: () => import('./components/landing-page/landing-page').then(m => m.LandingPage),
    },

    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./components/dashboard-layout/dashboard-layout').then(m => m.DashboardComponent),
        children: [
            { path: 'dashboard', canActivate: [dashboardRedirectGuard], children: [] },

            ...adminRoutes,
            ...proveedorRoutes,
            ...choferRoutes,
            ...usuarioRoutes,

            ...sharedRoutes,

            ...crudRoutes,
        ],
    },

    { path: '**', redirectTo: 'error/404' },
];
