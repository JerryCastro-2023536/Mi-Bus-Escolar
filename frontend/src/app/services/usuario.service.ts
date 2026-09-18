import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { ApiResponse } from '../models/apiResponseDTO.interface';
import { UsuarioDTO } from '../models/usuarioDTO.interface';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private crud = inject(CrudService);
  private endpoint = '/usuarios';

  listarUsuarios(): Observable<ApiResponse<UsuarioDTO[]>> {
    return this.crud.getAll<UsuarioDTO>(this.endpoint);
  }

  buscarUsuarioById(id: number): Observable<ApiResponse<UsuarioDTO>> {
    return this.crud.getById<UsuarioDTO>(this.endpoint, id);
  }

  agregarUsuario(data: Partial<UsuarioDTO>): Observable<ApiResponse<UsuarioDTO>> {
    return this.crud.create<UsuarioDTO>(this.endpoint, data);
  }

  editarUsuarioById(id: number, data: Partial<UsuarioDTO>): Observable<ApiResponse<UsuarioDTO>> {
    return this.crud.update<UsuarioDTO>(this.endpoint, id, data);
  }

  eliminarUsuarioById(id: number): Observable<ApiResponse<void>> {
    return this.crud.delete(this.endpoint, id);
  }
}