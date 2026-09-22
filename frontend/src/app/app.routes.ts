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

    { path: '**', redirectTo: 'login' },
];