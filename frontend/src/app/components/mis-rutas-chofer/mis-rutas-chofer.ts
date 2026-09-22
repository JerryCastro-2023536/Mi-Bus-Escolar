import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChoferDashboardService, RutaChoferDTO } from '../../services/choferdashboard.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-mis-rutas-chofer',
  styleUrl: './mis-rutas-chofer.css',
  templateUrl: './mis-rutas-chofer.html',
})
export class MisRutasChofer implements OnInit {
  private choferService = inject(ChoferDashboardService);
  private router = inject(Router);

  rutas = signal<RutaChoferDTO[]>([]);
  cargando = signal<boolean>(true);
  filtro = signal<'TODAS' | 'ACTIVO' | 'INACTIVO'>('TODAS');
  busqueda = signal<string>('');
  error = signal<string>('');

  filtradas = computed(() => {
    const f = this.filtro();
    const q = this.busqueda().trim().toLowerCase();

    return this.rutas().filter(r => {
      const matchFiltro =
        f === 'TODAS' ||
        r.estado?.toUpperCase() === f;

      const matchBusqueda =
        !q ||
        r.nombre?.toLowerCase().includes(q) ||
        r.servicio_nombre?.toLowerCase().includes(q) ||
        r.vehiculo_placa?.toLowerCase().includes(q);

      return matchFiltro && matchBusqueda;
    });
  });

  ngOnInit(): void {
    this.cargarRutas();
  }

  cargarRutas(): void {
    this.cargando.set(true);
    this.error.set('');

    this.choferService.resolverIdChofer().subscribe({
      next: (idChofer) => {
        this.choferService.getRutas(idChofer).subscribe({
          next: (data) => {
            this.rutas.set(data);
            this.cargando.set(false);
          },
          error: (err) => {
            console.error('Error cargando rutas del chofer:', err);
            this.error.set('No se pudieron cargar las rutas asignadas.');
            this.cargando.set(false);
          }
        });
      },
      error: () => {
        this.error.set('Error resolviendo la identidad del chofer.');
        this.cargando.set(false);
      }
    });
  }

  irAlMapa(): void {
    this.router.navigate(['/ruta-chofer']);
  }

  labelEstado(estado: string): string {
    const e = estado?.toUpperCase();
    if (e === 'ACTIVO' || e === 'ACTIVA') return 'Activa';
    if (e === 'INACTIVO' || e === 'INACTIVA') return 'Inactiva';
    return estado || 'Asignada';
  }
}
