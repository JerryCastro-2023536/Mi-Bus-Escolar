import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChoferDashboardService, VehiculoChoferDTO } from '../../services/choferdashboard.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-mis-buses-chofer',
  styleUrl: './mis-buses-chofer.css',
  templateUrl: './mis-buses-chofer.html',
})
export class MisBusesChofer implements OnInit {
  private choferService = inject(ChoferDashboardService);

  vehiculos = signal<VehiculoChoferDTO[]>([]);
  cargando = signal<boolean>(true);
  filtro = signal<'TODOS' | 'ACTIVO' | 'INACTIVO'>('TODOS');
  busqueda = signal<string>('');
  error = signal<string>('');

  filtrados = computed(() => {
    const f = this.filtro();
    const q = this.busqueda().trim().toLowerCase();

    return this.vehiculos().filter(v => {
      const matchFiltro =
        f === 'TODOS' ||
        v.estado?.toUpperCase() === f;

      const matchBusqueda =
        !q ||
        v.placa?.toLowerCase().includes(q) ||
        v.proveedor?.toLowerCase().includes(q) ||
        v.ruta_asignada?.toLowerCase().includes(q);

      return matchFiltro && matchBusqueda;
    });
  });

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  cargarVehiculos(): void {
    this.cargando.set(true);
    this.error.set('');

    this.choferService.resolverIdChofer().subscribe({
      next: (idChofer) => {
        this.choferService.getVehiculos(idChofer).subscribe({
          next: (data) => {
            this.vehiculos.set(data);
            this.cargando.set(false);
          },
          error: (err) => {
            console.error('Error cargando vehículos del chofer:', err);
            this.error.set('No se pudieron cargar los buses asignados.');
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
    if (e === 'ACTIVO' || e === 'ACTIVA') return 'Activo';
    if (e === 'INACTIVO' || e === 'INACTIVA') return 'Inactivo';
    return estado || 'Asignado';
  }
}
