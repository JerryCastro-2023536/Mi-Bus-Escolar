import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  idChoferActual = 1;
  vehiculos: any[] = [];
  estudiantes: any[] = [];
  reportes: any[] = [];
  rutasAsignadas: any[] = [];
  selectedRutaId: number | null = null;
  flujoActual: 1 | 2 | 3 = 1;

  vehiculosAbierto = false;
  estudiantesAbierto = false;
  reportesAbierto = false;

  get vehiculoActual(): any {
    return this.vehiculos[0] ?? {
      id_vehiculo: 1,
      placa: 'KTR-842',
      estado: 'ACTIVO',
      nombre: 'Bus #12',
      proveedor: 'Mi Bus Escolar'
    };
  }

  get estudiantesCount(): number {
    return this.estudiantes.length || 24;
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

    const tokenActual = localStorage.getItem('token') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplcnJ5QGdtYWlsLmNvbSIsInJvbCI6IlVTVUFSSU8iLCJpYXQiOjE3ODk2MDQ4ODksImV4cCI6MTc4OTYzMzY4OX0._5bQPd6eOMi2Pk3GLn3MXq7TiUidfgT2Ivu4Ci58gLc';
    localStorage.setItem('token', tokenActual);
    this.cargarRutasAsignadas();
    this.cargarDatosDashboardChofer();
  }

  private getDefaultRoutes(): any[] {
    return [
      { id_ruta: 1, nombre: 'Ruta #01', zona: 'Zona Centro - Col. Las Flores', id_chofer: 1 },
      { id_ruta: 4, nombre: 'Ruta #04', zona: 'Zona Norte - Col. San José', id_chofer: 1 },
      { id_ruta: 7, nombre: 'Ruta #07', zona: 'Zona Sur - Col. La Primavera', id_chofer: 1 },
    ];
  }

  private getDefaultVehicles(): any[] {
    return [{ id_vehiculo: 1, placa: 'KTR-842', estado: 'ACTIVO', proveedor: 'Mi Bus Escolar' }];
  }

  private getDefaultStudents(): any[] {
    return [
      { id_estudiante: 1, nombre: 'Ana', apellido: 'García', grado: '3°', colegio: 'San José' },
      { id_estudiante: 2, nombre: 'Luis', apellido: 'Pérez', grado: '4°', colegio: 'San José' },
      { id_estudiante: 3, nombre: 'María', apellido: 'López', grado: '5°', colegio: 'San José' }
    ];
  }

  cargarRutasAsignadas(): void {
    const baseUrl = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    this.http.get(`${baseUrl}/rutas`, { headers }).subscribe({
      next: (res: any) => {
        const rutas = Array.isArray(res?.data) ? res.data : [];
        this.rutasAsignadas = rutas
          .filter((ruta: any) => Number(ruta.id_chofer) === this.idChoferActual)
          .map((ruta: any) => ({
            id_ruta: ruta.id_ruta ?? ruta.id,
            nombre: ruta.nombre || `Ruta #${ruta.id_ruta ?? ruta.id}`,
            zona: ruta.zona || ruta.descripcion || 'Ruta asignada al chofer',
            id_chofer: ruta.id_chofer,
          }));

        if (!this.rutasAsignadas.length) {
          this.rutasAsignadas = this.getDefaultRoutes();
        }

        this.selectedRutaId = this.rutasAsignadas[0]?.id_ruta ?? null;
        this.flujoActual = 1;
      },
      error: () => {
        this.rutasAsignadas = this.getDefaultRoutes();
        this.selectedRutaId = this.rutasAsignadas[0]?.id_ruta ?? null;
        this.flujoActual = 1;
      }
    });
  }

  onRutaSeleccionada(): void {
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
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    this.http.get(`${baseUrl}/chofer-dashboard/${this.idChoferActual}/vehiculos`, { headers }).subscribe({
      next: (res: any) => {
        const vehiculos = Array.isArray(res?.data) ? res.data : [];
        this.vehiculos = vehiculos.length ? vehiculos : this.getDefaultVehicles();
      },
      error: () => {
        this.vehiculos = this.getDefaultVehicles();
      }
    });

    this.http.get(`${baseUrl}/chofer-dashboard/${this.idChoferActual}/estudiantes`, { headers }).subscribe({
      next: (res: any) => {
        const estudiantes = Array.isArray(res?.data) ? res.data : [];
        this.estudiantes = estudiantes.length ? estudiantes : this.getDefaultStudents();
      },
      error: () => {
        this.estudiantes = this.getDefaultStudents();
      }
    });

    this.http.get(`${baseUrl}/chofer-dashboard/${this.idChoferActual}/reportes`, { headers }).subscribe({
      next: (res: any) => {
        this.reportes = Array.isArray(res?.data) ? res.data : [];
      },
      error: (err) => {
        console.error('Error cargando reportes del chofer', err);
        this.reportes = [];
      }
    });
  }

  toggleVehiculos(): void {
    this.vehiculosAbierto = !this.vehiculosAbierto;
  }

  toggleEstudiantes(): void {
    this.estudiantesAbierto = !this.estudiantesAbierto;
  }

  toggleReportes(): void {
    this.reportesAbierto = !this.reportesAbierto;
  }
}