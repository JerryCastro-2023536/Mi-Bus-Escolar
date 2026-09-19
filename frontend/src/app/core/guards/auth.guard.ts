import { LoginService } from './../../services/login';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getDashboardRoute } from '../../config/role.config';

export const authGuard: CanActivateFn = (_route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.getUser()) return true;

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

export const guestGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const user = loginService.getUser();

  return user ? router.createUrlTree([getDashboardRoute(user.rol)]) : true;
};