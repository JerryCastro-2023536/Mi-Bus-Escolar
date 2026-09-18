import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-dashboard-chofer',
  styleUrl: './dashboard-chofer.components.css',
  templateUrl: './dashboard-chofer.components.html',
})
export class DashboardChoferComponents implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  idChoferActual = 1;
  vehiculos: any[] = [];
  estudiantes: any[] = [];
  reportes: any[] = [];

  vehiculosAbierto = false;
  estudiantesAbierto = false;
  reportesAbierto = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const tokenActual = localStorage.getItem('token') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplcnJ5QGdtYWlsLmNvbSIsInJvbCI6IlVTVUFSSU8iLCJpYXQiOjE3ODk2MDQ4ODksImV4cCI6MTc4OTYzMzY4OX0._5bQPd6eOMi2Pk3GLn3MXq7TiUidfgT2Ivu4Ci58gLc';
    localStorage.setItem('token', tokenActual);
    this.cargarDatosDashboardChofer();
  }

  cargarDatosDashboardChofer(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const baseUrl = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    this.http.get(`${baseUrl}/chofer-dashboard/${this.idChoferActual}/vehiculos`, { headers }).subscribe({
      next: (res: any) => this.vehiculos = res.data || [],
      error: (err) => console.error('Error cargando vehículos del chofer', err)
    });

    this.http.get(`${baseUrl}/chofer-dashboard/${this.idChoferActual}/estudiantes`, { headers }).subscribe({
      next: (res: any) => this.estudiantes = res.data || [],
      error: (err) => console.error('Error cargando estudiantes del chofer', err)
    });

    this.http.get(`${baseUrl}/chofer-dashboard/${this.idChoferActual}/reportes`, { headers }).subscribe({
      next: (res: any) => this.reportes = res.data || [],
      error: (err) => console.error('Error cargando reportes del chofer', err)
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