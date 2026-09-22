import { LoginService } from './../../services/login';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getDashboardRoute } from '../../config/role.config';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (_route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);


  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (loginService.getUser()) return true;

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

export const guestGuard: CanActivateFn = (route) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const user = loginService.getUser();
  if (user) {
    const returnUrl = route.queryParams['returnUrl'];
    return router.createUrlTree([returnUrl || getDashboardRoute(user.rol)]);
  }

  return true;
};