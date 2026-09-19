import { Component, OnInit, ChangeDetectorRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { LoginService } from '../../services/login';
import { UsuarioService } from '../../services/usuario.service';
import { SidebarUser } from '../../models/sidebar.model';
import { CloudinaryService } from '../../services/cloudinary.service';
import { UsuarioDTO, userRol } from '../../models/usuarioDTO.interface';

@Component({
  selector: 'app-cuenta-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cuenta-view.html',
  styleUrl: './cuenta-view.css'
})
export class CuentaView implements OnInit {
  private loginService = inject(LoginService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private cloudinaryService = inject(CloudinaryService);
  private cdr = inject(ChangeDetectorRef);

  usuario: UsuarioDTO = {
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    telefono: '',
    foto_usuario: null,
    rol: userRol.USUARIO,
    correo_verificado: false
  };

  tabActiva: 'perfil' | 'seguridad' | 'rol' = 'perfil';

  guardando = signal(false);
  mensajeExito = signal('');
  mensajeError = signal('');

  mostrarPasswordNueva = false;
  mostrarPasswordConfirmar = false;

  subiendoFoto = signal(false);
  draggingImage = false;
  private passwordActual = '';

  onFotoSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.subirFoto(file);
    input.value = '';
  }

  onDragOverImage(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingImage = true;
  }

  onDragLeaveImage(event: DragEvent): void {
    event.preventDefault();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    if (
      event.clientX <= rect.left ||
      event.clientX >= rect.right ||
      event.clientY <= rect.top ||
      event.clientY >= rect.bottom
    ) {
      this.draggingImage = false;
    }
  }

  onFileDropFoto(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingImage = false;

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    this.subirFoto(file);
  }

  private subirFoto(file: File): void {
    this.subiendoFoto.set(true);
    this.mensajeError.set('');

    this.cloudinaryService.upload(file, 'usuarios').subscribe({
      next: (url) => {
        this.usuario.foto_usuario = url;

        this.usuarioService.editarUsuarioById(this.usuario.id_usuario!, this.payloadUsuario({ foto_usuario: url })).subscribe({
          next: () => {
            this.loginService.updateFotoUsuario(url); // propaga a header y sidebar
            this.subiendoFoto.set(false);
            this.mensajeExito.set('Foto de perfil actualizada correctamente');
          },
          error: () => {
            this.subiendoFoto.set(false);
            this.mensajeError.set('No se pudo guardar la foto en el servidor');
          }
        });
      },
      error: () => {
        this.subiendoFoto.set(false);
        this.mensajeError.set('No se pudo subir la imagen. Intenta de nuevo.');
      }
    });
  }

  removeFoto(): void {
    this.usuario.foto_usuario = null;

    this.usuarioService.editarUsuarioById(this.usuario.id_usuario!, this.payloadUsuario({ foto_usuario: null })).subscribe({
      next: () => {
        this.loginService.updateFotoUsuario(''); 
        this.mensajeExito.set('Foto de perfil eliminada');
      },
      error: () => {
        this.mensajeError.set('No se pudo eliminar la foto en el servidor');
      }
    });
  }

  seguridad = { antiguaPassword: '', nuevaPassword: '', confirmarPassword: '' };

  ngOnInit(): void {
    const sesion = this.loginService.getUser();
    if (sesion) {
      this.usuario = { ...this.usuario, ...sesion, id_usuario: sesion.id_usuario ?? sesion.id ?? 1 };
      this.usuarioService.buscarUsuarioById(this.usuario.id_usuario!).subscribe({
        next: (response) => {
          if (!response?.data) return;
          this.passwordActual = response.data.password || '';
          this.usuario = { ...this.usuario, ...response.data };
          this.cdr.markForCheck();
        }
      });
    }
  }

  get sidebarUser(): SidebarUser | null {
    return {
      name: `${this.usuario.nombre} ${this.usuario.apellido}`.trim() || 'Usuario',
      role: this.usuario.rol,
      foto: this.usuario.foto_usuario ?? undefined
    };
  }

  get userInitial(): string {
    return (this.usuario.nombre || 'U').charAt(0).toUpperCase();
  }

  get tieneMinimo8() { return this.seguridad.nuevaPassword.length >= 8; }
  get tieneMayuscula() { return /[A-Z]/.test(this.seguridad.nuevaPassword); }
  get tieneNumero() { return /[0-9]/.test(this.seguridad.nuevaPassword); }
  get passwordsCoinciden() { return this.seguridad.nuevaPassword === this.seguridad.confirmarPassword && this.tieneMinimo8; }

  guardarPerfil(): void {
    const payload: Partial<UsuarioDTO> = {
      nombre: this.usuario.nombre.trim(),
      apellido: this.usuario.apellido.trim(),
      correo: this.usuario.correo.trim(),
      telefono: this.usuario.telefono?.trim() || '55512345',
      foto_usuario: this.usuario.foto_usuario
    };

    this.actualizar(payload, '¡Datos de perfil actualizados exitosamente!');
  }

  actualizarPassword(): void {
    if (!this.seguridad.antiguaPassword) {
      this.mensajeError.set('Debes ingresar tu contraseña actual.');
      return;
    }
    if (this.seguridad.nuevaPassword !== this.seguridad.confirmarPassword) {
      this.mensajeError.set('Las contraseñas no coinciden.');
      return;
    }
    if (!this.seguridad.nuevaPassword) {
      this.mensajeError.set('Debes ingresar una contraseña.');
      return;
    }

    this.guardando.set(true);
    this.mensajeExito.set('');
    this.mensajeError.set('');

    this.usuarioService.cambiarPassword(this.usuario.id_usuario!, {
      oldPassword: this.seguridad.antiguaPassword,
      newPassword: this.seguridad.nuevaPassword
    }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mensajeExito.set('¡Contraseña actualizada exitosamente!');
        this.seguridad = { antiguaPassword: '', nuevaPassword: '', confirmarPassword: '' };
      },
      error: (err) => {
        const errorData = err?.error;
        if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          this.mensajeError.set(errorData.errors[0]?.mensaje || errorData.message || 'Error de validación');
        } else {
          this.mensajeError.set(errorData?.message || err?.message || 'Error al actualizar la contraseña');
        }
        this.guardando.set(false);
      }
    });
  }

  private actualizar(payload: Partial<UsuarioDTO>, mensaje: string): void {
    this.guardando.set(true);
    this.mensajeExito.set('');
    this.mensajeError.set('');

    this.usuarioService.editarUsuarioById(this.usuario.id_usuario!, this.payloadUsuario(payload)).subscribe({
      next: () => this.finalizarActualizacion(mensaje),
      error: (err) => {
        const errorData = err?.error;
        if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          this.mensajeError.set(errorData.errors[0]?.mensaje || errorData.message || 'Error de validación');
        } else {
          this.mensajeError.set(errorData?.message || err?.message || 'Error al procesar la solicitud');
        }
        this.guardando.set(false);
      }
    });
  }

  private finalizarActualizacion(mensaje: string): void {
    this.guardando.set(false);
    if (mensaje) this.mensajeExito.set(mensaje);
    this.loginService.saveUser({ ...this.loginService.getUser(), ...this.usuario, password: undefined });
  }

  private payloadUsuario(changes: Partial<UsuarioDTO> = {}): Partial<UsuarioDTO> {
    const password = changes.password || this.passwordActual || this.usuario.password;
    if (changes.password) this.passwordActual = changes.password;
    return {
      ...this.usuario,
      ...changes,
      password,
      rol: this.usuario.rol,
      correo_verificado: this.usuario.correo_verificado ?? false
    };
  }

  onLogout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}