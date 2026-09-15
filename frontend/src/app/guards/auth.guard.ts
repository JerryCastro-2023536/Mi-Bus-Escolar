import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login';

export const authGuard: CanActivateFn = () => {
    const loginService = inject(LoginService);
    const router = inject(Router);

    if (loginService.getToken()) {
        return true;
    }

    return router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
    const loginService = inject(LoginService);
    const router = inject(Router);

    if (!loginService.getToken()) {
        return true;
    }

    return router.createUrlTree(['/dashboard']);
};
