import { Component, computed, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { LoginService } from '../../services/login';
import { getDashboardRoute } from '../../config/role.config';

export type ErrorScene = 'lost' | 'blocked' | 'breakdown' | 'expired' | 'maintenance' | 'offline';
export type ErrorAction = 'panel' | 'login' | 'retry' | 'back';

export interface ErrorHint {
  icon: string;
  text: string;
}

export interface ErrorConfig {
  code: number;
  display: string;
  pill: string;
  scene: ErrorScene;
  tone: string;
  kicker: string;
  kickerIcon: string;
  title: string;
  description: string;
  sceneLabel: string;
  hints: ErrorHint[];
  primary: ErrorAction;
  secondary: ErrorAction;
}

const ACTIONS: Record<ErrorAction, { label: string; icon: string }> = {
  panel: { label: 'Volver a mi panel', icon: 'house' },
  login: { label: 'Iniciar sesión', icon: 'right-to-bracket' },
  retry: { label: 'Reintentar', icon: 'rotate-right' },
  back: { label: 'Regresar', icon: 'arrow-left' }
};

export const ERROR_CONFIGS: Record<number, ErrorConfig> = {
  401: {
    code: 401,
    display: '401',
    pill: 'Error 401',
    scene: 'expired',
    tone: '#38BDF8',
    kicker: 'Sesión expirada',
    kickerIcon: 'ticket',
    title: 'Tu boleto de sesión venció',
    description:
      'Por seguridad, tu sesión puede vencer o dejar de ser válida. Inicia sesión de nuevo para continuar con tu recorrido.',
    sceneLabel: 'Un bus escolar con un reloj y un boleto de sesión sellado como vencido',
    hints: [
      { icon: 'lock', text: 'Cuidamos tu cuenta protegiendo tu sesión' },
      { icon: 'key', text: 'Ten a la mano tu correo y contraseña' }
    ],
    primary: 'login',
    secondary: 'back'
  },
  403: {
    code: 403,
    display: '403',
    pill: 'Error 403',
    scene: 'blocked',
    tone: '#F87171',
    kicker: 'Acceso restringido',
    kickerIcon: 'hand',
    title: 'Esta parada no está autorizada para tu rol',
    description:
      'Tu cuenta no tiene permisos para ver esta sección. Si crees que es un error, pide acceso al administrador del sistema.',
    sceneLabel: 'Un bus escolar detenido frente a una barrera y una señal de alto, con un candado',
    hints: [
      { icon: 'user-shield', text: 'Tu rol define qué módulos puedes ver' },
      { icon: 'headset', text: 'Contacta al administrador si necesitas acceso' },
      { icon: 'house', text: 'Regresa a tu panel principal' }
    ],
    primary: 'panel',
    secondary: 'back'
  },
  404: {
    code: 404,
    display: '404',
    pill: 'Error 404',
    scene: 'lost',
    tone: '#FFD141',
    kicker: 'Ruta no encontrada',
    kickerIcon: 'map-location-dot',
    title: 'Este bus se desvió del recorrido',
    description:
      'La página que buscas no existe o cambió de parada. Revisa la dirección o vuelve al recorrido principal.',
    sceneLabel: 'Un bus escolar perdido, con un signo de interrogación y una señal de ruta desconocida',
    hints: [
      { icon: 'map-location-dot', text: 'Verifica que la dirección esté bien escrita' },
      { icon: 'bars', text: 'Usa el menú lateral para navegar' },
      { icon: 'clock-rotate-left', text: 'La página pudo haber sido movida' }
    ],
    primary: 'panel',
    secondary: 'back'
  },
  500: {
    code: 500,
    display: '500',
    pill: 'Error 500',
    scene: 'breakdown',
    tone: '#FB923C',
    kicker: 'Falla mecánica',
    kickerIcon: 'screwdriver-wrench',
    title: 'Se averió el motor del servidor',
    description:
      'Tuvimos un problema inesperado al procesar tu solicitud. No es tu culpa: hay que revisar el motor antes de volver a la ruta.',
    sceneLabel: 'Un bus escolar con el capó abierto, echando humo, junto a dos engranajes',
    hints: [
      { icon: 'rotate-right', text: 'Intenta de nuevo en unos segundos' },
      { icon: 'clock', text: 'Anota la hora del error para reportarlo' },
      { icon: 'headset', text: 'Si continúa, avisa al administrador' }
    ],
    primary: 'retry',
    secondary: 'panel'
  },
  503: {
    code: 503,
    display: '503',
    pill: 'Error 503',
    scene: 'maintenance',
    tone: '#5FB89C',
    kicker: 'En mantenimiento',
    kickerIcon: 'screwdriver-wrench',
    title: 'Estamos en el taller afinando el servicio',
    description:
      'El sistema no está disponible por ahora, por mantenimiento o por alta demanda. Vuelve a intentarlo en unos minutos.',
    sceneLabel: 'Un bus escolar junto a un letrero de "en taller", conos de tráfico y engranajes',
    hints: [
      { icon: 'screwdriver-wrench', text: 'Hay trabajos de mantenimiento en curso' },
      { icon: 'hourglass-half', text: 'Puede tardar unos minutos' },
      { icon: 'rotate-right', text: 'Reintenta más tarde' }
    ],
    primary: 'retry',
    secondary: 'panel'
  },
  0: {
    code: 0,
    display: 'OFF',
    pill: 'Sin conexión',
    scene: 'offline',
    tone: '#94A3B8',
    kicker: 'Sin señal',
    kickerIcon: 'wifi',
    title: 'El bus perdió la señal',
    description:
      'No pudimos comunicarnos con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.',
    sceneLabel: 'Un bus escolar con un símbolo de wifi tachado',
    hints: [
      { icon: 'wifi', text: 'Verifica tu Wi-Fi o tus datos móviles' },
      { icon: 'server', text: 'El servidor podría estar apagado' },
      { icon: 'rotate-right', text: 'Reintenta en unos segundos' }
    ],
    primary: 'retry',
    secondary: 'back'
  }
};

@Component({
  selector: 'app-error-view',
  standalone: true,
  templateUrl: './errors.html',
  styleUrl: './errors.css'
})
export class ErrorView {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private loginService = inject(LoginService);

  readonly config = toSignal(
    this.route.data.pipe(map(data => ERROR_CONFIGS[Number(data['code'])] ?? ERROR_CONFIGS[404])),
    { initialValue: ERROR_CONFIGS[404] }
  );

  readonly sesionActiva = computed(() => !!this.loginService.user());
  readonly codeChars = computed(() => this.config().display.split(''));

  readonly actions = computed(() => {
    const cfg = this.config();
    const activa = this.sesionActiva();

    return [cfg.primary, cfg.secondary].map((kind, index) => {
      const base = kind === 'panel' && !activa ? ACTIONS.login : ACTIONS[kind];
      return { kind, label: base.label, icon: base.icon, primary: index === 0 };
    });
  });

  readonly occurredAt = new Date().toLocaleString('es-GT', { dateStyle: 'medium', timeStyle: 'short' });

  run(kind: ErrorAction): void {
    switch (kind) {
      case 'panel':
        this.router.navigateByUrl(
          this.sesionActiva() ? getDashboardRoute(this.loginService.user()?.rol) : '/login'
        );
        break;
      case 'login':
        this.loginService.logout();
        this.router.navigateByUrl('/login');
        break;
      case 'retry':
        window.location.reload();
        break;
      case 'back':
        if (window.history.length > 1) {
          this.location.back();
        } else {
          this.router.navigateByUrl('/dashboard');
        }
        break;
    }
  }
}