import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LoginService } from '../../services/login';

const ERROR_ROUTES: Record<number, string> = {
    401: '/error/401',
    403: '/error/403',
    404: '/error/404',
    500: '/error/500',
    503: '/error/503',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);
    const router = inject(Router);
    const loginService = inject(LoginService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const isLandingRoute = router.url.split('?')[0] === '/landing';
            const ignoreUnauthorizedOnLanding =
                isLandingRoute && error.status === 401;

            if (
                isPlatformBrowser(platformId) &&
                !ignoreUnauthorizedOnLanding &&
                !router.url.startsWith('/error/')
            ) {
                const route = error.status === 0
                    ? '/error/sin-conexion'
                    : ERROR_ROUTES[error.status];

                if (route) {
                    if (error.status === 401) {
                        loginService.logout();
                    }
                    void router.navigateByUrl(route);
                }
            }

            return throwError(() => error);
        })
    );
};
