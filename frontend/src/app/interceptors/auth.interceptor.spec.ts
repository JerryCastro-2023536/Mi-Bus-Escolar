import { TestBed } from '@angular/core/testing';
import {HttpClient, provideHttpClient, withInterceptors,} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting,} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { LoginService } from '../services/login';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let loginService: LoginService;

  beforeEach(() => {
    window.localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    loginService = TestBed.inject(LoginService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('agrega el header Authorization con el token guardado', () => {
    loginService.saveToken('token-demo');

    http.get('/api/usuarios').subscribe();
    const req = httpMock.expectOne('/api/usuarios');

    expect(req.request.headers.get('Authorization')).toBe('Bearer token-demo');
    req.flush({ ok: true });
  });

  it('no agrega Authorization cuando no hay token guardado', () => {
    http.get('/api/usuarios').subscribe();
    const req = httpMock.expectOne('/api/usuarios');

    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush({ ok: true });
  });

  it('cierra la sesion cuando el backend responde 401', () => {
    loginService.saveToken('token-expirado');
    loginService.saveUser({ id_usuario: 1, correo: 'a@b.com' });

    http.get('/api/usuarios').subscribe({ error: () => {} });
    const req = httpMock.expectOne('/api/usuarios');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(loginService.getToken()).toBeNull();
    expect(loginService.getUser()).toBeNull();
  });
});