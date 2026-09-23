import { environment } from '../../environments/enviroment';
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioLoginDTO } from '../models/usuarioDTO.interface';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  usuario?: any;
  errors?: Array<{ campo: string; mensaje: string }>;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  // Signal reactivo con el usuario actual, inicializado desde localStorage
  private userSignal = signal<any>(this.readUserFromStorage());
  user = this.userSignal.asReadonly();

  private readUserFromStorage(): any {
    if (typeof window === 'undefined') return null;
    const u = localStorage.getItem('auth_user');
    return u ? JSON.parse(u) : null;
  }

  login(data: UsuarioLoginDTO): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  saveUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
    this.userSignal.set(user);
  }

  getUser(): any {
    return this.userSignal();
  }

  getIdChofer(): number | null {
    const user = this.userSignal();
    return user?.id_chofer ? Number(user.id_chofer) : null;
  }

  updateFotoUsuario(url: string): void {
    const current = this.userSignal();
    if (!current) return;

    const updated = { ...current, foto_usuario: url };
    this.userSignal.set(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(updated));
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    this.userSignal.set(null);
  }
}