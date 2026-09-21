import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login';
import { UsuarioLoginDTO, UsuarioRegisterDTO } from '../../models/usuarioDTO.interface';
import { RegisterService } from '../../services/register';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private loginService = inject(LoginService);
  private registerService = inject(RegisterService);
  private cloudinaryService = inject(CloudinaryService);
  private router = inject(Router);

  isLoginMode = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  fieldErrors = signal<Array<{ campo: string; mensaje: string }>>([]);

  currentUser = signal<any>(null);
  currentToken = signal<string | null>(null);
  uploadingPhoto = signal(false);
  draggingImage = false;

  loginForm: UsuarioLoginDTO = {
    correo: '',
    password: ''
  };

  registerForm: UsuarioRegisterDTO = {
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    telefono: '',
    foto_usuario: ''
  };

  ngOnInit(): void {
    const user = this.loginService.getUser();
    const token = this.loginService.getToken();
    if (user && token) {
      this.currentUser.set(user);
      this.currentToken.set(token);
    }
  }

  toggleMode(mode: boolean): void {
    this.isLoginMode.set(mode);
    this.clearMessages();
  }

  onRegisterPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.uploadRegisterPhoto(file);
    input.value = '';
  }

  onRegisterPhotoDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingImage = true;
  }

  onRegisterPhotoDragLeave(event: DragEvent): void {
    event.preventDefault();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    if (event.clientX <= rect.left || event.clientX >= rect.right ||
        event.clientY <= rect.top || event.clientY >= rect.bottom) {
      this.draggingImage = false;
    }
  }

  onRegisterPhotoDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingImage = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.uploadRegisterPhoto(file);
  }

  private uploadRegisterPhoto(file: File): void {
    this.uploadingPhoto.set(true);
    this.cloudinaryService.upload(file, 'usuarios').subscribe({
      next: (url) => {
        this.registerForm.foto_usuario = url;
        this.uploadingPhoto.set(false);
      },
      error: () => {
        this.uploadingPhoto.set(false);
        this.errorMessage.set('No se pudo subir la imagen. Intenta de nuevo.');
      }
    });
  }

  removeRegisterPhoto(): void {
    this.registerForm.foto_usuario = null;
  }

  clearMessages(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.fieldErrors.set([]);
  }

  onLogin(): void {
    this.clearMessages();
    this.isLoading.set(true);

    this.loginService.login(this.loginForm).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.token && res.usuario) {
          this.loginService.saveToken(res.token);
          this.loginService.saveUser(res.usuario);
          this.currentUser.set(res.usuario);
          this.currentToken.set(res.token);
          this.router.navigateByUrl('/dashboard');
        } else {
          this.successMessage.set(res.message || 'Login exitoso');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.handleError(err);
      }
    });
  }

  onRegister(): void {
    this.clearMessages();
    this.isLoading.set(true);

    const payload: UsuarioRegisterDTO = {
      ...this.registerForm,
      foto_usuario: this.registerForm.foto_usuario?.trim() || null
    };

    this.registerService.register(payload).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.token && res.usuario) {
          this.loginService.saveToken(res.token);
          this.loginService.saveUser(res.usuario);
          this.currentUser.set(res.usuario);
          this.currentToken.set(res.token);
          this.successMessage.set('Registro exitoso');
        } else {
          this.successMessage.set(res.message || 'Registro exitoso');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.handleError(err);
      }
    });
  }

  onLogout(): void {
    this.loginService.logout();
    this.currentUser.set(null);
    this.currentToken.set(null);
    this.clearMessages();
    this.successMessage.set('Sesion cerrada correctamente');
  }

  goToDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  private handleError(err: any): void {
    if (err?.status === 0) {
      this.errorMessage.set('No se pudo conectar con el servidor del backend');
      return;
    }
    const errorRes = err?.error;
    if (errorRes) {
      if (errorRes.errors && Array.isArray(errorRes.errors)) {
        this.fieldErrors.set(errorRes.errors);
      }
      this.errorMessage.set(errorRes.message || errorRes.error || 'ocurrio un error en al cargar la solicitud');
    } else {
      this.errorMessage.set(err?.message || 'ocurrio un error al cargar la solicitud');
    }
  }

  showLoginPassword = signal(false);
  showRegisterPassword = signal(false);

  toggleLoginPassword(): void {
    this.showLoginPassword.update(v => !v);
  }

  toggleRegisterPassword(): void {
    this.showRegisterPassword.update(v => !v);
  }

  fieldError(campo: string): string | null {
    return this.fieldErrors().find(e => e.campo === campo)?.mensaje ?? null;
  }

}
