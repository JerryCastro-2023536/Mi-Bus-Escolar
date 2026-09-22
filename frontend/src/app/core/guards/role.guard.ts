import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../services/login';
import { normalizeRole, getDashboardRoute } from '../../config/role.config';

export const roleGuard: CanActivateFn = (route, state) => {
    const platformId = inject(PLATFORM_ID);
    const loginService = inject(LoginService);
    const router = inject(Router);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    const user = loginService.getUser();

    if (!user) {
        return router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url }
        });
    }

    const allowedRoles =
        (route.data?.['roles'] as string[] | undefined)
            ?.map(role => role.toUpperCase());

    if (!allowedRoles || allowedRoles.length === 0) {
        return true;
    }

    const role = normalizeRole(user.rol);

    if (allowedRoles.includes(role)) {
        return true;
    }

    return router.createUrlTree(['/error/403']);
};

export const dashboardRedirectGuard: CanActivateFn = () => {
    const platformId = inject(PLATFORM_ID);
    const loginService = inject(LoginService);
    const router = inject(Router);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    return router.createUrlTree([getDashboardRoute(loginService.getUser()?.rol)]);
};