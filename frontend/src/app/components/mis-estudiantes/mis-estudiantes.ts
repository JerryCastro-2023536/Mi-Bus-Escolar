import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginService } from '../../services/login';
import { UsuarioViewService } from '../../services/usuario-view.service';

import { EstudianteResumen } from '../../models/pago.model';

@Component({
    selector: 'app-mis-estudiantes',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mis-estudiantes.html',
    styleUrl: './mis-estudiantes.css'
})
export class MisEstudiantes implements OnInit {

    private loginService = inject(LoginService);
    private usuarioViewService = inject(UsuarioViewService);

    estudiantes = signal<EstudianteResumen[]>([]);

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
}