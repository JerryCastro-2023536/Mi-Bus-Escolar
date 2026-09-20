import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../services/login';
import { normalizeRole, getDashboardRoute } from '../../config/role.config';

export const roleGuard: CanActivateFn = (route, state) => {
    const loginService = inject(LoginService);
    const router = inject(Router);

    const user = loginService.getUser();
    if (!user) {
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    const allowedRoles = (route.data?.['roles'] as string[] | undefined)?.map(r => r.toUpperCase());
    if (!allowedRoles || allowedRoles.length === 0) return true;

    const role = normalizeRole(user.rol);
    if (allowedRoles.includes(role)) return true;

    return router.createUrlTree([getDashboardRoute(role)]);
};

export const dashboardRedirectGuard: CanActivateFn = () => {
    const loginService = inject(LoginService);
    const router = inject(Router);
    return router.createUrlTree([getDashboardRoute(loginService.getUser()?.rol)]);
};