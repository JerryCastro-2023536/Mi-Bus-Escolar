import { Routes } from '@angular/router';


export const sharedRoutes: Routes = [
    {
        path: 'cuenta',
        title: 'Mi Cuenta | MiBusEscolar',
        loadComponent: () => import('../components/cuenta-view/cuenta-view').then(m => m.CuentaView),
        data: {
            title: 'Centro de Cuenta & Perfil',
            subtitle: 'Gestiona tu información personal, credenciales de acceso y visualiza los permisos de tu rol.'
        }
    },
    {
        path: 'notificaciones',
        title: 'Notificaciones | MiBusEscolar',
        loadComponent: () => import('../components/notificaciones/notificaciones').then(m => m.Notificaciones),
        data: {
            title: 'Bandeja de Notificaciones',
            subtitle: 'Centro de avisos, alertas de ruta, asistencias e incidencias según tu rol en el sistema.'
        }
    },
];