import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';


export const proveedorRoutes: Routes = [
    {
        path: 'dashboard/proveedor',
        title: 'Proveedor | MiBusEscolar',
        canActivate: [roleGuard],
        data: { roles: ['PROVEEDOR'] },
        loadComponent: () => import('../components/proveedores-view/proveedores-view').then(m => m.ProveedoresView),
    },
    {
        path: 'mis-vehiculos',
        title: 'Mis Vehículos | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/vehiculos-proveedor-view/vehiculos-proveedor-view').then(m => m.VehiculosProveedorView),
        data: {
            roles: ['PROVEEDOR'],
            title: 'Mis Vehículos',
            subtitle: 'Administra tu flota, sube fotos y consulta a qué ruta y chofer está asignado cada vehículo.'
        }
    },
    {
        path: 'mis-choferes',
        title: 'Mis Choferes | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/choferes-proveedor-view/choferes-proveedor-view').then(m => m.ChoferesProveedorView),
        data: { roles: ['PROVEEDOR'], title: 'Mis Choferes', subtitle: 'Administra los choferes y las rutas que tienen asignadas.' }
    },
    {
        path: 'mis-servicios',
        title: 'Mis Servicios | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/mis-servicios-view/mis-servicios-view').then(m => m.MisServiciosView),
        data: {
            roles: ['PROVEEDOR'],
            title: 'Mis Servicios',
            subtitle: 'Consulta, agrega y edita tus servicios asignados.'
        }
    },
    {
        path: 'mis-rutas',
        title: 'Mis Rutas | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/rutas-proveedor-view/rutas-proveedor-view').then(m => m.RutasProveedorView),
        data: { roles: ['PROVEEDOR'], title: 'Mis Rutas', subtitle: 'Administra rutas, horarios, choferes y vehículos.' }
    },
    {
        path: 'asignacion-ruta-proveedor',
        title: 'Asignación de Ruta | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/asignacion-ruta-proveedor-view/asignacion-ruta-proveedor-view').then(m => m.AsignacionRutaProveedorView),
        data: { roles: ['PROVEEDOR'], title: 'Asignación de Ruta', subtitle: 'Administra los estudiantes asignados a tus rutas.' }
    },
    {
        path: 'mis-incidencias',
        title: 'Incidencias | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/incidencias-proveedor-view/incidencias-proveedor-view').then(m => m.IncidenciasProveedorView),
        data: { roles: ['PROVEEDOR'], title: 'Incidencias', subtitle: 'Consulta las incidencias reportadas en tus rutas.' }
    },
    {
        path: 'mis-viajes-proveedor',
        title: 'Viajes | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/viajes-proveedor-view/viajes-proveedor-view').then(m => m.ViajesProveedorView),
        data: { roles: ['PROVEEDOR'], title: 'Viajes', subtitle: 'Consulta viajes en curso y finalizados.' }
    },
    {
        path: 'mis-valoraciones',
        title: 'Valoraciones | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/valoraciones-proveedor-view/valoraciones-proveedor-view').then(m => m.ValoracionesProveedorView),
        data: { roles: ['PROVEEDOR'], title: 'Valoraciones', subtitle: 'Consulta las valoraciones recibidas por tu proveedor.' }
    },
    {
        path: 'pagos-proveedor',
        title: 'Pagos | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/pagos-proveedor-view/pagos-proveedor-view').then(m => m.PagosProveedorView),
        data: { roles: ['PROVEEDOR'], title: 'Pagos', subtitle: 'Consulta los pagos de cada uno de los estudiantes asignados a tus servicios' }
    },
];