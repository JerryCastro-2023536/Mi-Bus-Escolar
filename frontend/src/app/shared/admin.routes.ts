import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';

export const adminRoutes: Routes = [
    {
        path: 'dashboard/admin',
        title: 'Administrador | MiBusEscolar',
        canActivate: [roleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        loadComponent: () => import('../components/admin-view/admin-view').then(m => m.AdminView),
    },
];