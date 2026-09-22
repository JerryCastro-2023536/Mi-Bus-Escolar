import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChoferDashboardService, EstudianteChoferDTO } from '../../services/choferdashboard.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-mis-asistencias-chofer',
  styleUrl: './mis-asistencias-chofer.css',
  templateUrl: './mis-asistencias-chofer.html',
})
export class MisAsistenciasChofer implements OnInit {
  private choferService = inject(ChoferDashboardService);

  estudiantes = signal<EstudianteChoferDTO[]>([]);
  cargando = signal<boolean>(true);
  busqueda = signal<string>('');
  error = signal<string>('');

  filtrados = computed(() => {
    const q = this.busqueda().trim().toLowerCase();

    return this.estudiantes().filter(e => {
      return (
        !q ||
        e.nombre?.toLowerCase().includes(q) ||
        e.apellido?.toLowerCase().includes(q) ||
        e.grado?.toLowerCase().includes(q) ||
        e.colegio?.toLowerCase().includes(q) ||
        e.ruta_asignada?.toLowerCase().includes(q)
      );
    });
  });

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.cargando.set(true);
    this.error.set('');

    this.choferService.resolverIdChofer().subscribe({
      next: (idChofer) => {
        this.choferService.getEstudiantes(idChofer).subscribe({
          next: (data) => {
            this.estudiantes.set(data);
            this.cargando.set(false);
          },
          error: (err) => {
            console.error('Error cargando estudiantes:', err);
            this.error.set('No se pudieron cargar los estudiantes asignados.');
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
}