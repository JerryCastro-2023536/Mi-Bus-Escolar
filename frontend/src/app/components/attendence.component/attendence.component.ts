import { Component, inject, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { AsistenciaService } from '../../services/asistencia.service';
import {
    MisRutaDTO,
    EstudianteRutaDTO,
    ReporteHoyDTO,
    EstadoMarca,
} from '../../models/asistenciasDTO.interface';
import { toastSuccess, toastError, extractMessage } from '../../helpers/swal-toast';
import { ApiResponse } from '../../models/apiResponseDTO.interface';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendence.html',
  styleUrl: './attendence.css'
})
export class AttendanceComponent {
  private asistenciaService = inject(AsistenciaService);

  ruta = input.required<MisRutaDTO>();

  cerrar = output<void>();

  reporteEnviado = output<{ presentes: number; ausentes: number; notificaciones: number }>();

  cargando = signal(false);
  estudiantes = signal<EstudianteRutaDTO[]>([]);
  estados = signal<Record<number, string>>({}); 
  enviando = signal(false);

  fechaHoy = new Date().toISOString().slice(0, 10);

  contadores = computed(() => {
    const map = this.estados();
    let presentes = 0;
    let ausentes = 0;
    let pendientes = 0;
    for (const s of this.estudiantes()) {
      const e = map[s.id_estudiante];
      if (e === 'PRESENTE') presentes++;
      else if (e === 'AUSENTE') ausentes++;
      else pendientes++;
    }
    return { presentes, ausentes, pendientes };
  });

  constructor() {
    effect(() => {
      this.cargarChecklist(this.ruta());
    });
  }

  
  cargarChecklist(ruta: MisRutaDTO) {
    this.cargando.set(true);
    this.estudiantes.set([]);
    this.estados.set({});

    let pendientes = 2;
    const fin = () => {
      if (--pendientes === 0) this.cargando.set(false);
    };

    this.asistenciaService.getEstudiantesRuta(ruta.id_ruta).subscribe({
      next: (res: ApiResponse<EstudianteRutaDTO[]>) => {
        this.estudiantes.set(res.data ?? []);
        fin();
      },
      error: (err: HttpErrorResponse) => {
        toastError(extractMessage(err, 'No se pudo cargar la lista de estudiantes'));
        fin();
      }
    });

    this.asistenciaService.getReporteHoy(ruta.id_ruta).subscribe({
      next: (res: ApiResponse<ReporteHoyDTO>) => {
        const map: Record<number, string> = {};
        (res.data?.asistencias ?? []).forEach(a => {
          map[a.id_estudiante] = a.estado_abordaje;
        });
        this.estados.set(map);
        fin();
      },
      error: () => fin()
    });
  }


  estadoDe(idEstudiante: number): string {
    return this.estados()[idEstudiante] ?? 'PENDIENTE';
  }

  marcar(idEstudiante: number, estado: EstadoMarca) {
    this.estados.update(map => ({ ...map, [idEstudiante]: estado }));
  }

  marcarTodosPresentes() {
    const map: Record<number, string> = {};
    for (const s of this.estudiantes()) {
      map[s.id_estudiante] = 'PRESENTE';
    }
    this.estados.set(map);
  }

  enviarReporte() {
    const ruta = this.ruta();
    if (!ruta) return;

    this.enviando.set(true);
    this.asistenciaService.getReporteHoy(ruta.id_ruta).subscribe({
      next: (res: ApiResponse<ReporteHoyDTO>) => {
        const idViaje = res.data?.id_viaje;
        if (!idViaje) {
          this.enviando.set(false);
          toastError('No se pudo generar el viaje de hoy');
          return;
        }

        const asistencias = this.estudiantes().map(s => ({
          id_estudiante: s.id_estudiante,
          estado_abordaje: this.estadoDe(s.id_estudiante) as EstadoMarca,
        }));

        this.asistenciaService.enviarReporte({ id_viaje: idViaje, asistencias }).subscribe({
          next: (r2: ApiResponse<{ presentes: number; ausentes: number; notificaciones: number }>) => {
            this.enviando.set(false);
            const resumen = r2.data
              ? ` · ${r2.data.presentes} presentes, ${r2.data.ausentes} ausentes`
              : '';
            toastSuccess(r2.message ?? `Reporte enviado${resumen}`);
            if (r2.data) this.reporteEnviado.emit(r2.data);
          },
          error: (err: HttpErrorResponse) => {
            this.enviando.set(false);
            toastError(extractMessage(err, 'No se pudo enviar el reporte'));
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.enviando.set(false);
        toastError(extractMessage(err, 'No se pudo preparar el reporte'));
      }
    });
  }


  fmtHora(hora?: string): string {
    return hora ? hora.slice(0, 5) : '—';
  }

  iniciales(est: EstudianteRutaDTO): string {
    return `${est.nombre?.[0] ?? ''}${est.apellido?.[0] ?? ''}`.toUpperCase();
  }
}
