import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Usuario } from '../../../../backend/src/models/usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private crud = inject(CrudService);
  private endpoint = '/usuarios';

  listarUsuarios(): Observable<Usuario[]> {
    return this.crud.getAll<Usuario>(this.endpoint);
  }

  buscarUsuarioById(id: number): Observable<Usuario> {
    return this.crud.getById<Usuario>(this.endpoint, id);
  }

  agregarUsuario(data: Partial<Usuario>): Observable<Usuario> {
    return this.crud.create<Usuario>(this.endpoint, data);
  }

  editarUsuarioById(id: number, data: Partial<Usuario>): Observable<Usuario> {
    return this.crud.update<Usuario>(this.endpoint, id, data);
  }

  eliminarUsuarioById(id: number): Observable<void> {
    return this.crud.delete(this.endpoint, id);
  }
}
