import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { LoginService } from '../../services/login';
import { UsuarioService } from '../../services/usuario.service';
import { HeaderComponent } from '../../shared/header/header';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { SidebarUser } from '../../models/sidebar.model';
import { Usuario } from '../../../../../backend/src/models/usuario';
import { userRol } from '../../../../../backend/src/enums/userRol';

@Component({
  selector: 'app-cuenta-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, SidebarComponent],
  templateUrl: './cuenta-view.html',
  styleUrl: './cuenta-view.css'
})
export class CuentaView implements OnInit {
  private loginService = inject(LoginService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  tabActiva: 'perfil' | 'seguridad' | 'rol' = 'perfil';
  guardando = false;
  mensajeExito = '';
  mensajeError = '';

  mostrarPasswordNueva = false;
  mostrarPasswordConfirmar = false;

  usuario: Usuario = {
    id_usuario: 0,
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    telefono: '',
    foto_usuario: '',
    rol: userRol.USUARIO,
    correo_verificado: false
  };

  seguridad = { nuevaPassword: '', confirmarPassword: '' };

  ngOnInit(): void {
    const sesion = this.loginService.getUser();
    if (sesion) {
      this.usuario = { ...this.usuario, ...sesion, id_usuario: sesion.id || sesion.id_usuario || 1 };
      this.usuarioService.buscarUsuarioById(this.usuario.id_usuario!).subscribe({
        next: (data) => { if (data) Object.assign(this.usuario, data); }
      });
    }
  }

  get sidebarUser(): SidebarUser | null {
    return { name: `${this.usuario.nombre} ${this.usuario.apellido}`.trim() || 'Usuario', role: this.usuario.rol };
  }

  get userInitial(): string {
    return (this.usuario.nombre || 'U').charAt(0).toUpperCase();
  }

  get tieneMinimo8() { return this.seguridad.nuevaPassword.length >= 8; }
  get tieneMayuscula() { return /[A-Z]/.test(this.seguridad.nuevaPassword); }
  get tieneNumero() { return /[0-9]/.test(this.seguridad.nuevaPassword); }
  get passwordsCoinciden() { return this.seguridad.nuevaPassword === this.seguridad.confirmarPassword && this.tieneMinimo8; }

  guardarPerfil(): void {
    const payload: Usuario = {
      ...this.usuario,
      nombre: this.usuario.nombre.trim(),
      apellido: this.usuario.apellido.trim(),
      correo: this.usuario.correo.trim(),
      password: this.usuario.password || 'TemporalPassword123',
      telefono: this.usuario.telefono?.trim() || '55512345',
      foto_usuario: this.usuario.foto_usuario?.trim() || null
    };

    this.actualizar(payload, '¡Datos de perfil actualizados exitosamente!');
  }

  actualizarPassword(): void {
    if (this.seguridad.nuevaPassword !== this.seguridad.confirmarPassword) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    if (!this.seguridad.nuevaPassword) {
      this.mensajeError = 'Debes ingresar una contraseña.';
      return;
    }

    this.actualizar({ ...this.usuario, password: this.seguridad.nuevaPassword }, '¡Contraseña actualizada exitosamente!');
    this.seguridad = { nuevaPassword: '', confirmarPassword: '' };
  }

  private actualizar(payload: Partial<Usuario>, mensaje: string): void {
    this.guardando = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    this.usuarioService.editarUsuarioById(this.usuario.id_usuario!, payload).subscribe({
      next: () => this.finalizarActualizacion(mensaje),
      error: (err) => {
        const errorData = err?.error;
        if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          this.mensajeError = errorData.errors[0]?.mensaje || errorData.message || 'Error de validación';
        } else {
          this.mensajeError = errorData?.message || err?.message || 'Error al procesar la solicitud';
        }
        this.guardando = false;
      }
    });
  }

  private finalizarActualizacion(mensaje: string): void {
    this.guardando = false;
    if (mensaje) this.mensajeExito = mensaje;
    this.loginService.saveUser({ ...this.loginService.getUser(), ...this.usuario });
  }

  onLogout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
