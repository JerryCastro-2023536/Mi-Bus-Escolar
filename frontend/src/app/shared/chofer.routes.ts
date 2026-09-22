import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';

export const choferRoutes: Routes = [
    {
        path: 'dashboard/chofer',
        title: 'Dashboard Chofer | MiBusEscolar',
        canActivate: [roleGuard],
        data: {
            roles: ['CHOFER'],
            title: 'Gestión de acciones del chofer',
            subtitle: 'Administracion de Rutas, Estudiantes, Buses y Reportes del chofer asignado.'
        },
        loadComponent: () => import('../components/dashboard-chofer/dashboard-chofer.components').then(d => d.DashboardChoferComponents),
    },
    {
        path: 'asistencias-chofer',
        title: 'Asistencias - Chofer | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/mis-estudiantes-chofer/mis-asistencias-chofer').then(a => a.MisAsistenciasChofer),
        data: { roles: ['CHOFER'], title: 'Asistencias - Chofer', subtitle: 'Ver el historial de las asistencias de los alumnos por viaje' }
    },
    {
        path: 'reportes-chofer',
        title: 'Reportes - Chofer | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/mis-incidencias-chofer/mis-incidencias-chofer').then(m => m.MisIncidenciasChofer),
        data: { roles: ['CHOFER'], title: 'Reportes - Chofer', subtitle: 'Ver el historial de los reportes hechos por el chofer' }
    },
    {
        path: 'mis-rutas-chofer',
        title: 'Mis Rutas - Chofer | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/mis-rutas-chofer/mis-rutas-chofer').then(m => m.MisRutasChofer),
        data: { roles: ['CHOFER'], title: 'Mis Rutas - Chofer', subtitle: 'Ver las rutas asignadas del chofer' }
    },
    {
        path: 'buses-chofer',
        title: 'Buses - Chofer | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/mis-buses-chofer/mis-buses-chofer').then(m => m.MisBusesChofer),
        data: { roles: ['CHOFER'], title: 'Buses - Chofer', subtitle: 'Ver los buses asignados por chofer' }
    },
    {
        path: 'ruta-chofer',
        title: 'Ruta Chofer | MiBusEscolar',
        loadComponent: () => import('../components/mapa-chofer/chofer-dashboard.components').then(d => d.ChoferDashboardComponents),
        data: {
            roles: ['CHOFER'],
            title: 'Gestión de Rutas del chofer',
            subtitle: 'Ver las rutas, tomar asistencias, iniciar viaje, anotar abordaje y finalizar ruta.'
        }
    },
];