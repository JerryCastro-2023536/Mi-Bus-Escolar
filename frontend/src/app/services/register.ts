import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from './login';

export interface UsuarioRegisterDTO {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  telefono: string;
  foto_usuario?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  register(data: UsuarioRegisterDTO): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }
}
