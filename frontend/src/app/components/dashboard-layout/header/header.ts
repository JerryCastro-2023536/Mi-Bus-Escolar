import { Component, computed, inject, input, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SidebarUser } from '../../../models/sidebar.model';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { LoginService } from '../../../services/login';
import { TiempoRelativoPipe } from '../../../shared/pipes/tiempoRelativo.pipe';
import { NotificacionEstiloPipe } from '../../../shared/pipes/notificacionEstilo.pipe';

interface RoleChip {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, TiempoRelativoPipe, NotificacionEstiloPipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  user = input<SidebarUser | null>(null);
  title = input<string | undefined>(undefined);
  subtitle = input<string | undefined>(undefined);

  notifService = inject(NotificacionesService);
  loginService = inject(LoginService);
  private router = inject(Router);

  panelAbierto = false;

  currentTime = signal<string>('');
  private timeInterval: any;

  ngOnInit(): void {
    this.updateClock();
    if (typeof window !== 'undefined') {
      this.timeInterval = setInterval(() => this.updateClock(), 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateClock(): void {
    const now = new Date();
    this.currentTime.set(
      now.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    );
  }

  togglePanel(): void {
    this.panelAbierto = !this.panelAbierto;
  }

  cerrarPanel(): void {
    this.panelAbierto = false;
  }

  marcarLeida(id?: number): void {
    if (id !== undefined) {
      this.notifService.marcarComoLeida(id);
    }
  }

  marcarTodas(): void {
    this.notifService.marcarTodasComoLeidas();
  }

  eliminar(id?: number): void {
    if (id !== undefined) {
      this.notifService.eliminarNotificacion(id);
    }
  }

  onLogout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  currentDate = computed(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('es-GT', options);
  });

  greetingInfo = computed(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: '¡Buenos días', icon: 'fa-sun', desc: '¡Que tengas una jornada productiva!' };
    } else if (hour >= 12 && hour < 19) {
      return { text: '¡Buenas tardes', icon: 'fa-cloud-sun', desc: 'Monitoreo de la tarde en curso' };
    } else {
      return { text: '¡Buenas noches', icon: 'fa-moon', desc: 'Resumen de actividades nocturnas' };
    }
  });

  displayTitle = computed(() => {
    if (this.title()) return this.title();
    const u = this.user();
    const name = u?.name || 'Usuario';
    return `${this.greetingInfo().text}, ${name}!`;
  });

  displaySubtitle = computed(() => {
    if (this.subtitle()) return this.subtitle();
    const role = (this.user()?.role || '').toUpperCase();
    switch (role) {
      case 'ADMINISTRADOR':
      case 'ADMIN':
        return 'Panel de administración general, métricas del sistema y control de operaciones.';
      case 'PROVEEDOR':
        return 'Panel de gestión para tus colegios afiliados, rutas y flotilla de buses.';
      case 'CHOFER':
        return 'Panel operativo de rutas asignadas, asistencias y seguimiento de viajes en tiempo real.';
      case 'USUARIO':
        return 'Panel de seguimiento para padres de familia: ubicación de buses y notificaciones en vivo.';
      default:
        return 'Resumen general de operaciones y estado del transporte escolar.';
    }
  });

  roleLabel = computed(() => {
    const role = (this.user()?.role || '').toUpperCase();
    switch (role) {
      case 'ADMINISTRADOR':
      case 'ADMIN':
        return 'Administrador General';
      case 'PROVEEDOR':
        return 'Proveedor de Transporte';
      case 'CHOFER':
        return 'Chofer Autorizado';
      case 'USUARIO':
        return 'Tutor / Padre de Familia';
      default:
        return role || 'Usuario Registrado';
    }
  });

  roleIcon = computed(() => {
    const role = (this.user()?.role || '').toUpperCase();
    switch (role) {
      case 'ADMINISTRADOR':
      case 'ADMIN':
        return 'fa-shield-halved';
      case 'PROVEEDOR':
        return 'fa-building-shield';
      case 'CHOFER':
        return 'fa-id-badge';
      case 'USUARIO':
        return 'fa-graduation-cap';
      default:
        return 'fa-user-circle';
    }
  });

  roleChips = computed<RoleChip[]>(() => {
    const role = (this.user()?.role || '').toUpperCase();
    switch (role) {
      case 'ADMINISTRADOR':
      case 'ADMIN':
        return [
          { icon: 'fa-server', label: 'Sistema 100% Operativo' },
          { icon: 'fa-shield-check', label: 'Acceso Total' },
          { icon: 'fa-bolt', label: 'Tiempo Real Activo' }
        ];
      case 'PROVEEDOR':
        return [
          { icon: 'fa-bus', label: 'Gestión de Unidades' },
          { icon: 'fa-school', label: 'Colegios Afiliados' },
          { icon: 'fa-file-invoice-dollar', label: 'Facturación' }
        ];
      case 'CHOFER':
        return [
          { icon: 'fa-route', label: 'Rutas Asignadas' },
          { icon: 'fa-location-dot', label: 'GPS Transmitiendo' },
          { icon: 'fa-clipboard-user', label: 'Lista de Estudiantes' }
        ];
      case 'USUARIO':
        return [
          { icon: 'fa-bell', label: 'Alertas Activas' },
          { icon: 'fa-map-pin', label: 'Paradas Seguras' },
          { icon: 'fa-heart', label: 'Transporte Conectado' }
        ];
      default:
        return [
          { icon: 'fa-bus', label: 'Mi Bus Escolar' },
          { icon: 'fa-check', label: 'Sesión Segura' }
        ];
    }
  });

  userInitial = computed(() => {
    const name = this.user()?.name || 'U';
    return name.charAt(0).toUpperCase();
  });
}