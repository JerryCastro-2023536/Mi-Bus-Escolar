import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';

export const usuarioRoutes: Routes = [
    {
        path: 'dashboard/usuario',
        title: 'Mi Panel | MiBusEscolar',
        canActivate: [roleGuard],
        data: {
            roles: ['USUARIO'],
            title: 'Panel principal',
            subtitle: 'Consulta la información de tus estudiantes, viajes, paradas y pagos.'
        },
        loadComponent: () => import('../components/usuarios-view/usuarios-view').then(m => m.UsuariosView),
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
        loadComponent: () => import('../components/mis-estudiantes/mis-estudiantes').then(m => m.MisEstudiantes),
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
        loadComponent: () => import('../components/paradas-usuario/paradas-usuario').then(m => m.ParadasUsuario),
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
        loadComponent: () => import('../components/viajes-usuario/viajes-usuario').then(m => m.ViajesUsuario),
    },
    {
        path: 'pagosUser',
        title: 'Mis Pagos | MiBusEscolar',
        canActivate: [roleGuard],
        loadComponent: () => import('../components/pagos-view/pagos-view').then(m => m.PagosView),
        data: {
            roles: ['USUARIO'],
            title: 'Mis Pagos',
            subtitle: 'Consulta y realiza los pagos del transporte escolar de tus hijos.'
        }
    },
];