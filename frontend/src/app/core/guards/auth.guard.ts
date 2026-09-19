import { LoginService } from './../../services/login';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

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

  return loginService.getUser() ? router.createUrlTree(['/dashboard']) : true;
};

/** Redirige al dashboard correcto según el rol del usuario autenticado */
export const dashboardRedirectGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const user = loginService.getUser();
  if (!user) return router.createUrlTree(['/login']);

  const rol: string = (user.rol ?? '').toUpperCase();

  if (rol === 'ADMINISTRADOR') {
    return router.createUrlTree(['/dashboard-administrador']);
  } else if (rol === 'CHOFER') {
    return router.createUrlTree(['/dashboard-chofer']);
  } else {
    // USUARIO u otro rol: redirige a su cuenta/perfil
    return router.createUrlTree(['/cuenta']);
  }
};