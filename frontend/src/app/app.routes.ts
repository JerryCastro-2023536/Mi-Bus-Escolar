import { PagosProveedorView } from './components/pagos-proveedor-view/pagos-proveedor-view';
import { crudRoutes } from './shared/crud.routes';
import { Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa.component';
import { ChoferDashboardComponents } from './components/mapa-chofer/chofer-dashboard.components';
import { DashboardChoferComponents } from './components/dashboard-chofer/dashboard-chofer.components';
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
        canActivate: [guestGuard],
        loadComponent: () => import('./components/landing-page/landing-page').then(m => m.LandingPage),
    },

    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./components/dashboard-layout/dashboard-layout').then(m => m.DashboardComponent),
        children: [
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
                loadComponent: () => import('../app/components/proveedores-view/proveedores-view').then(m => m.ProveedoresView),
            },
            {
                path: 'dashboard/chofer',
                title: 'Dashboard Chofer | MiBusEscolar',
                canActivate: [roleGuard],
                data: {
                    roles: ['CHOFER'],
                    title: 'Gestión de acciones del chofer',
                    subtitle: 'Administracion de Rutas, Estudiantes, Buses y Reportes del chofer asignado.'
                },
                loadComponent: () => import('./components/dashboard-chofer/dashboard-chofer.components').then(d => d.DashboardChoferComponents),
            },
            {
                path: 'dashboard-chofer',
                redirectTo: 'dashboard/chofer',
                pathMatch: 'full'
            },
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
                path: 'mis-viajes',
                title: 'Mis Viajes | MiBusEscolar',
                canActivate: [roleGuard],
                data: {
                    roles: ['USUARIO'],
                    title: 'Mis viajes',
                    subtitle: 'Consulta los viajes de los estudiantes asignados.'
                },
                loadComponent: () =>
                    import('./components/viajes-usuario/viajes-usuario')
                        .then(m => m.ViajesUsuario),
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
                path: "ruta-chofer",
                title: "Ruta Chofer | MiBusEscolar",
                loadComponent: () => import('./components/mapa-chofer/chofer-dashboard.components').then(d => d.ChoferDashboardComponents),
                data: {
                    title: "Gestión de Rutas del chofer",
                    subtitle: "Ver las rutas, tomar asistencias, iniciar viaje, anotar abordaje y finalizar ruta."
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

            { path: 'mis-choferes', title: 'Mis Choferes | MiBusEscolar', canActivate: [roleGuard], loadComponent: () => import('./components/choferes-proveedor-view/choferes-proveedor-view').then(m => m.ChoferesProveedorView), data: { roles: ['PROVEEDOR'], title: 'Mis Choferes', subtitle: 'Administra los choferes y las rutas que tienen asignadas.' } },
            { path: 'mis-rutas', title: 'Mis Rutas | MiBusEscolar', canActivate: [roleGuard], loadComponent: () => import('./components/rutas-proveedor-view/rutas-proveedor-view').then(m => m.RutasProveedorView), data: { roles: ['PROVEEDOR'], title: 'Mis Rutas', subtitle: 'Administra rutas, horarios, choferes y vehículos.' } },
            { path: 'asignacion-ruta-proveedor', title: 'Asignación de Ruta | MiBusEscolar', canActivate: [roleGuard], loadComponent: () => import('./components/asignacion-ruta-proveedor-view/asignacion-ruta-proveedor-view').then(m => m.AsignacionRutaProveedorView), data: { roles: ['PROVEEDOR'], title: 'Asignación de Ruta', subtitle: 'Administra los estudiantes asignados a tus rutas.' } },
            { path: 'mis-incidencias', title: 'Incidencias | MiBusEscolar', canActivate: [roleGuard], loadComponent: () => import('./components/incidencias-proveedor-view/incidencias-proveedor-view').then(m => m.IncidenciasProveedorView), data: { roles: ['PROVEEDOR'], title: 'Incidencias', subtitle: 'Consulta las incidencias reportadas en tus rutas.' } },
            { path: 'mis-viajes', title: 'Viajes | MiBusEscolar', canActivate: [roleGuard], loadComponent: () => import('./components/viajes-proveedor-view/viajes-proveedor-view').then(m => m.ViajesProveedorView), data: { roles: ['PROVEEDOR'], title: 'Viajes', subtitle: 'Consulta viajes en curso y finalizados.' } },
            { path: 'mis-valoraciones', title: 'Valoraciones | MiBusEscolar', canActivate: [roleGuard], loadComponent: () => import('./components/valoraciones-proveedor-view/valoraciones-proveedor-view').then(m => m.ValoracionesProveedorView), data: { roles: ['PROVEEDOR'], title: 'Valoraciones', subtitle: 'Consulta las valoraciones recibidas por tu proveedor.' } },
            { path: 'pagos-proveedor', title: 'Pagos | MiBusEscolar', canActivate: [roleGuard], loadComponent: () => import('./components/pagos-proveedor-view/pagos-proveedor-view').then(m => m.PagosProveedorView), data: { roles: ['PROVEEDOR'], title: 'Pagos', subtitle: 'Consulta los pagos de cada uno de los estudiantes asignados a tus servicios' } },
            { path: "asistencias-chofer", title: "Asistencias - Chofer | MiBusEscolar", canActivate: [roleGuard], loadComponent: () => import("./components/mis-estudiantes-chofer/mis-asistencias-chofer").then(a => a.MisAsistenciasChofer), data: { roles: ['CHOFER'], title: 'Asistencias - Chofer', subtitle: 'Ver el historial de las asistencias de los alumnos por viaje' } },
            { path: "reportes-chofer", title: "Reportes - Chofer | MiBusEscolar", canActivate: [roleGuard], loadComponent: () => import("./components/mis-incidencias-chofer/mis-incidencias-chofer").then(m => m.MisIncidenciasChofer), data: { roles: ['CHOFER'], title: 'Reportes - Chofer', subtitle: 'Ver el historial de los reportes hechos por el chofer' } },
            { path: "misrutas-chofer", title: "Mis Rutas - Chofer | MiBusEscolar", canActivate: [roleGuard], loadComponent: () => import("./components/mis-rutas-chofer/mis-rutas-chofer").then(m => m.MisRutasChofer), data: { roles: ['CHOFER'], title: 'Mis Rutas - Chofer', subtitle: 'Ver las rutas asignadas del chofer' } },
            { path: "buses-chofer", title: "Buses - Chofer | MiBusEscolar", canActivate: [roleGuard], loadComponent: () => import("./components/mis-buses-chofer/mis-buses-chofer").then(m => m.MisBusesChofer), data: { roles: ['CHOFER'], title: 'Buses - Chofer', subtitle: 'Ver los buses asignados por chofer' } },

            ...crudRoutes,
        ],
    },

    { path: '**', redirectTo: 'error/404' },
];
