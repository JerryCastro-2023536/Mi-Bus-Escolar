import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChoferDashboardService, ReporteChoferDTO } from '../../services/choferdashboard.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-mis-incidencias-chofer',
  styleUrl: './mis-incidencias-chofer.css',
  templateUrl: './mis-incidencias-chofer.html',
})
export class MisIncidenciasChofer implements OnInit {
  private choferService = inject(ChoferDashboardService);

  reportes = signal<ReporteChoferDTO[]>([]);
  cargando = signal<boolean>(true);
  filtro = signal<'TODOS' | 'ABIERTA' | 'CERRADA' | 'EN_PROCESO'>('TODOS');
  busqueda = signal<string>('');
  error = signal<string>('');

  filtrados = computed(() => {
    const f = this.filtro();
    const q = this.busqueda().trim().toLowerCase();

    return this.reportes().filter(r => {
      const matchFiltro =
        f === 'TODOS' ||
        r.estado?.toUpperCase() === f ||
        (f === 'ABIERTA' && (!r.estado || r.estado.toUpperCase() === 'ABIERTO' || r.estado.toUpperCase() === 'ABIERTA')) ||
        (f === 'CERRADA' && (r.estado?.toUpperCase() === 'CERRADO' || r.estado?.toUpperCase() === 'CERRADA' || r.estado?.toUpperCase() === 'FINALIZADO'));

      const matchBusqueda =
        !q ||
        r.titulo?.toLowerCase().includes(q) ||
        r.descripcion?.toLowerCase().includes(q) ||
        r.ruta?.toLowerCase().includes(q);

      return matchFiltro && matchBusqueda;
    });
  });

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.cargando.set(true);
    this.error.set('');

    this.choferService.resolverIdChofer().subscribe({
      next: (idChofer) => {
        this.choferService.getReportes(idChofer).subscribe({
          next: (data) => {
            this.reportes.set(data);
            this.cargando.set(false);
          },
          error: (err) => {
            console.error('Error cargando reportes:', err);
            this.error.set('No se pudieron cargar los reportes del chofer.');
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

  labelEstado(estado: string): string {
    const e = estado?.toUpperCase();
    if (e === 'ABIERTA' || e === 'ABIERTO') return 'Abierta';
    if (e === 'CERRADA' || e === 'CERRADO') return 'Cerrada';
    if (e === 'EN_PROCESO') return 'En proceso';
    return estado || 'Registrada';
  }
}
