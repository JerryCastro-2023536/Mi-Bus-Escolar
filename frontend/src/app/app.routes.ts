import { crudRoutes } from './shared/crud.routes';
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { roleGuard, dashboardRedirectGuard } from './core/guards/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },

    {
        path: 'login',
        title: 'Iniciar sesión | MiBusEscolar',
        loadComponent: () => import('./components/login/login').then(m => m.Login),
    },
    {
        path: 'landing',
        title: ' Landing Page| MiBusEscolar',
        canActivate: [guestGuard],
        loadComponent: () => import('./components/landing-page/landing-page').then(m => m.LandingPage),
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
            /*{
                path: 'dashboard/proveedor',
                title: 'Proveedor | MiBusEscolar',
                canActivate: [roleGuard],
                data: { roles: ['PROVEEDOR'] },
                loadComponent: () => import('../app/components/').then(m => m.ProveedorView),
            },
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
                data: {
                    roles: ['USUARIO'],
                    title: 'Panel principal',
                    subtitle: 'Consulta la información de tus estudiantes, viajes, paradas y pagos.'
                },
                loadComponent: () =>
                    import('./components/usuarios-view/usuarios-view')
                        .then(m => m.UsuariosView),
            },

            {
                path: 'mis-estudiantes',
                title: 'Mis Estudiantes | MiBusEscolar',
                canActivate: [roleGuard],
                data: {
                    roles: ['USUARIO'],
                    title: 'Mis Estudiantes',
                    subtitle: 'Consulta los estudiantes registrados a tu cargo.'
                },
                loadComponent: () =>
                    import('./components/mis-estudiantes/mis-estudiantes')
                        .then(m => m.MisEstudiantes),
            },

            {
                path: 'mis-paradas',
                title: 'Mis Paradas | MiBusEscolar',
                canActivate: [roleGuard],
                data: {
                    roles: ['USUARIO'],
                    title: 'Mis Paradas',
                    subtitle: 'Consulta los estudiantes que tienen asignaciones de transporte.'
                },
                loadComponent: () =>
                    import('./components/paradas-usuario/paradas-usuario')
                        .then(m => m.ParadasUsuario),
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

            ...crudRoutes,
        ],
    },

    { path: '**', redirectTo: 'login' },
];
