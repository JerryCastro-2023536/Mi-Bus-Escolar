import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-dashboard-chofer',
  styleUrl: './dashboard-chofer.components.css',
  templateUrl: './dashboard-chofer.components.html',
})
export class DashboardChoferComponents implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private loginService = inject(LoginService);

  idChoferActual = 1;
  vehiculos: any[] = [];
  estudiantes: any[] = [];
  reportes: any[] = [];
  rutasAsignadas: any[] = [];
  selectedRutaId: number | null = null;
  flujoActual: 1 | 2 | 3 = 1;

  get vehiculoActual(): any {
    return this.vehiculos[0] ?? null;
  }

  get estudiantesCount(): number {
    return this.estudiantes.length;
  }

  get rutaSeleccionada(): any | null {
    return this.rutasAsignadas.find(ruta => ruta.id_ruta === this.selectedRutaId) ?? this.rutasAsignadas[0] ?? null;
  }

  get flujoTitulo(): string {
    const mapa = {
      1: '1. Seleccionar ruta',
      2: '2. Asistencia',
      3: '3. Iniciar ruta',
    };
    return mapa[this.flujoActual];
  }

  get flujoDescripcion(): string {
    const mapa = {
      1: 'Elige la ruta asignada para continuar.',
      2: 'Confirma la asistencia del servicio.',
      3: 'Inicia la ruta y despliega la navegación.',
    };
    return mapa[this.flujoActual];
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cargarDashboardCompleto();
  }

  private cargarDashboardCompleto(): void {
    const user = this.loginService.getUser();
    const userId = user?.id_usuario || user?.id;

    if (user?.id_chofer) {
      this.idChoferActual = Number(user.id_chofer || this.idChoferActual);
      this.cargarRutasAsignadas();
      this.cargarDatosDashboardChofer();
      return;
    }

    if (userId) {
      this.http.get<any>(`http://localhost:3000/api/chofer/usuario/${userId}`).subscribe({
        next: (res) => {
          const choferId = res?.id_chofer ?? res?.data?.id_chofer;
          if (choferId) {
            this.idChoferActual = Number(choferId);
            this.loginService.saveUser({ ...user, id_chofer: choferId });
          }
          this.cargarRutasAsignadas();
          this.cargarDatosDashboardChofer();
        },
        error: () => {
          this.cargarRutasAsignadas();
          this.cargarDatosDashboardChofer();
        }
      });
      return;
    }

    this.cargarRutasAsignadas();
    this.cargarDatosDashboardChofer();
  }

  private sincronizarRutaSeleccionada(): void {
    if (!this.rutasAsignadas.length) {
      this.selectedRutaId = null;
      return;
    }

    const existeSeleccionActual = this.rutasAsignadas.some(ruta => Number(ruta.id_ruta) === Number(this.selectedRutaId));
    if (!existeSeleccionActual) {
      this.selectedRutaId = Number(this.rutasAsignadas[0].id_ruta);
    } else {
      this.selectedRutaId = Number(this.selectedRutaId);
    }
  }

  cargarRutasAsignadas(): void {
    const baseUrl = 'http://localhost:3000/api';
    const token = this.loginService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    this.http.get(`${baseUrl}/rutas`, { headers }).subscribe({
      next: (res: any) => {
        const rutas = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        this.rutasAsignadas = rutas
          .filter((ruta: any) => Number(ruta.id_chofer) === Number(this.idChoferActual))
          .map((ruta: any) => ({
            id_ruta: Number(ruta.id_ruta ?? ruta.id),
            nombre: ruta.nombre || `Ruta #${ruta.id_ruta ?? ruta.id}`,
            zona: ruta.zona || ruta.descripcion || 'Ruta asignada al chofer',
            id_chofer: Number(ruta.id_chofer),
          }));

        this.sincronizarRutaSeleccionada();
        this.flujoActual = 1;
      },
      error: () => {
        this.rutasAsignadas = [];
        this.selectedRutaId = null;
        this.flujoActual = 1;
      }
    });
  }

  onRutaSeleccionada(): void {
    this.selectedRutaId = Number(this.selectedRutaId);
    this.flujoActual = 1;
  }

  irARuta(): void {
    if (!this.selectedRutaId) {
      return;
    }

    this.flujoActual = 2;
    this.router.navigate(['/ruta-chofer']);
  }

  completarAsistencia(): void {
    this.flujoActual = 3;
  }

  finalizarViaje(): void {
    this.selectedRutaId = null;
    this.flujoActual = 1;
  }

  cargarDatosDashboardChofer(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const baseUrl = 'http://localhost:3000/api';
    const token = this.loginService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    this.http.get(`${baseUrl}/chofer-dashboard/${this.idChoferActual}/vehiculos`, { headers }).subscribe({
      next: (res: any) => {
        this.vehiculos = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      },
      error: () => {
        this.vehiculos = [];
      }
    });

    this.http.get(`${baseUrl}/chofer-dashboard/${this.idChoferActual}/estudiantes`, { headers }).subscribe({
      next: (res: any) => {
        this.estudiantes = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      },
      error: () => {
        this.estudiantes = [];
      }
    });

    this.http.get(`${baseUrl}/chofer-dashboard/${this.idChoferActual}/reportes`, { headers }).subscribe({
      next: (res: any) => {
        this.reportes = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      },
      error: (err) => {
        console.error('Error cargando reportes del chofer', err);
        this.reportes = [];
      }
    });
  }

  irAComponente(ruta: string): void {
  this.router.navigate([ruta]);
  }
}