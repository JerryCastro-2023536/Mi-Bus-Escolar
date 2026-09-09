import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginService } from '../services/login';

/**
 * Interceptor global de autenticación 
 *
 * 1. GUARDA LOS TOKENS: el almacenamiento real vive en LoginService
 *    en lo que es el localstorage y es ahi donde esta todo
 *    entonces este interceptor lo reutiliza, así que todo el
 *    proyecto comparte la misma sesión.
 *
 * 2. ENVÍA EL TOKEN EN CADA PETICIÓN: toda peticion HTTP que haga la
 *    app con las entidades va a salir con el header de autorizacion y
 *    que siempre exista el token guardado
 *    
 *
 * 3. SINCERÍA DE SESIÓN: si el backend tira 401, se va a limpiar la sesion
 *    guardada y se va a redirigir al login para que el usuario vuelva a aunteticarse
 *   
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const token = loginService.getToken();

  const request = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  return next(request).pipe(
    tap({
      error: (err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          loginService.logout();
          if (typeof window !== 'undefined' && router.url !== '/login') {
            router.navigate(['/login']);
          }
        }
      },
    })
  );
};