import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginService } from '../../services/login';
import { UsuarioViewService } from '../../services/usuario-view.service';

import { EstudianteResumen } from '../../models/pago.model';

@Component({
    selector: 'app-paradas-usuario',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './paradas-usuario.html',
    styleUrl: './paradas-usuario.css'
})
export class ParadasUsuario implements OnInit {

    private loginService = inject(LoginService);
    private usuarioViewService = inject(UsuarioViewService);

    estudiantes = signal<EstudianteResumen[]>([]);

    estudianteSeleccionado =
        signal<EstudianteResumen | null>(null);

    cargando = signal(false);

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

        this.cargando.set(true);
        this.mensajeError = '';

        this.usuarioViewService
            .listarEstudiantesPorTutor(idUsuario)
            .subscribe({

                next: (data) => {
                    this.estudiantes.set(data);
                    this.cargando.set(false);
                },

                error: () => {
                    this.cargando.set(false);

                    this.mensajeError =
                        'No se pudieron cargar los estudiantes.';
                }

            });
    }

    seleccionarEstudiante(
        estudiante: EstudianteResumen
    ): void {

        this.estudianteSeleccionado.set(estudiante);
    }

    volver(): void {

        this.estudianteSeleccionado.set(null);
        this.mensajeError = '';
    }
}