import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginService } from '../../services/login';
import { UsuarioViewService } from '../../services/usuario-view.service';

import { EstudianteResumen } from '../../models/pago.model';
import { ViajeUsuario } from '../../models/viaje-usuario.model';

@Component({
    selector: 'app-viajes-usuario',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './viajes-usuario.html',
    styleUrl: './viajes-usuario.css'
})
export class ViajesUsuario implements OnInit {

    private loginService = inject(LoginService);
    private usuarioViewService = inject(UsuarioViewService);

    estudiantes = signal<EstudianteResumen[]>([]);

    estudianteSeleccionado =
        signal<EstudianteResumen | null>(null);

    viajes = signal<ViajeUsuario[]>([]);

    cargandoEstudiantes = signal(false);

    cargandoViajes = signal(false);

    mensajeError = '';

    ngOnInit(): void {
        this.cargarEstudiantes();
    }

    private cargarEstudiantes(): void {

        const sesion = this.loginService.getUser();

        const idUsuario =
            sesion?.id_usuario ?? sesion?.id;

        if (!idUsuario) {

            this.mensajeError =
                'No se pudo identificar al usuario.';

            return;
        }

        this.cargandoEstudiantes.set(true);

        this.usuarioViewService
            .listarEstudiantesPorTutor(idUsuario)
            .subscribe({

                next: (data) => {

                    this.estudiantes.set(data);

                    this.cargandoEstudiantes.set(false);
                },

                error: () => {

                    this.cargandoEstudiantes.set(false);

                    this.mensajeError =
                        'No se pudieron cargar los estudiantes.';
                }

            });
    }

    seleccionarEstudiante(
        estudiante: EstudianteResumen
    ): void {

        this.estudianteSeleccionado.set(estudiante);

        this.viajes.set([]);

        this.mensajeError = '';

        this.cargandoViajes.set(true);

        this.usuarioViewService
            .listarViajesActivosPorEstudiante(
                estudiante.id_estudiante
            )
            .subscribe({

                next: (data) => {

                    this.viajes.set(data);

                    this.cargandoViajes.set(false);
                },

                error: () => {

                    this.cargandoViajes.set(false);

                    this.mensajeError =
                        'No se pudieron cargar los viajes activos.';
                }

            });
    }

    volver(): void {

        this.estudianteSeleccionado.set(null);

        this.viajes.set([]);

        this.mensajeError = '';
    }
}