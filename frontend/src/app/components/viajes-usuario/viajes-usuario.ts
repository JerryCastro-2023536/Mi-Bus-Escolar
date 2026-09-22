import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginService } from '../../services/login';
import { UsuarioViewService } from '../../services/usuario-view.service';
import { CrudService } from '../../services/crud.service';
import { FormComponent } from '../crud-view/form/form';
import { estudiantesConfig } from '../../models/estudiantes.model';
import Swal from 'sweetalert2';
import { toastSuccess, toastError, extractMessage } from '../../helpers/swal-toast';

import { EstudianteResumen } from '../../models/pago.model';
import { ViajeUsuario } from '../../models/viaje-usuario.model';
import { FormField } from '../../models/crudDTO.interface';

export type FiltroEstadoViaje = 'TODOS' | 'ACTIVOS' | 'PROGRAMADOS' | 'FINALIZADOS';

@Component({
    selector: 'app-viajes-usuario',
    standalone: true,
    imports: [CommonModule, FormComponent],
    templateUrl: './viajes-usuario.html',
    styleUrl: './viajes-usuario.css'
})
export class ViajesUsuario implements OnInit {

    private loginService = inject(LoginService);
    private usuarioViewService = inject(UsuarioViewService);
    private crudService = inject(CrudService);

    estudiantes = signal<EstudianteResumen[]>([]);
    estudianteSeleccionado = signal<EstudianteResumen | null>(null);
    viajes = signal<ViajeUsuario[]>([]);
    filtroEstado = signal<FiltroEstadoViaje>('TODOS');

    cargandoEstudiantes = signal(false);
    cargandoViajes = signal(false);
    mensajeError = '';

    estudianteAEditar = signal<any | null>(null);
    formFields: FormField[] = (estudiantesConfig.formFieldsEdit ?? []) as FormField[];

    viajesFiltrados = computed(() => {
        const filtro = this.filtroEstado();
        const lista = this.viajes();

        if (filtro === 'ACTIVOS') {
            return lista.filter(v => v.estado === 'ACTIVO');
        }
        if (filtro === 'PROGRAMADOS') {
            return lista.filter(v => v.estado === 'PROGRAMADO');
        }
        if (filtro === 'FINALIZADOS') {
            return lista.filter(v => v.estado === 'FINALIZADO');
        }

        return lista;
    });

    totalCount = computed(() => this.viajes().length);
    activosCount = computed(() => this.viajes().filter(v => v.estado === 'ACTIVO').length);
    programadosCount = computed(() => this.viajes().filter(v => v.estado === 'PROGRAMADO').length);
    finalizadosCount = computed(() => this.viajes().filter(v => v.estado === 'FINALIZADO').length);

    ngOnInit(): void {
        this.cargarEstudiantes();
    }

    cargarEstudiantes(): void {
        const sesion = this.loginService.getUser();
        const idUsuario = sesion?.id_usuario ?? sesion?.id;

        if (!idUsuario) {
            this.mensajeError = 'No se pudo identificar al usuario.';
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
                    this.mensajeError = 'No se pudieron cargar los estudiantes.';
                }
            });
    }

    seleccionarEstudiante(estudiante: EstudianteResumen): void {
        this.estudianteSeleccionado.set(estudiante);
        this.viajes.set([]);
        this.filtroEstado.set('TODOS');
        this.mensajeError = '';
        this.cargandoViajes.set(true);

        this.usuarioViewService
            .listarTodosViajesPorEstudiante(estudiante.id_estudiante)
            .subscribe({
                next: (data) => {
                    this.viajes.set(data);
                    this.cargandoViajes.set(false);
                },
                error: () => {
                    this.cargandoViajes.set(false);
                    this.mensajeError = 'No se pudieron cargar los viajes del estudiante.';
                }
            });
    }

    cambiarFiltro(filtro: FiltroEstadoViaje): void {
        this.filtroEstado.set(filtro);
    }

    volver(): void {
        this.estudianteSeleccionado.set(null);
        this.viajes.set([]);
        this.filtroEstado.set('TODOS');
        this.mensajeError = '';
    }

    editarEstudiante(estudiante: EstudianteResumen, event?: Event): void {
        if (event) event.stopPropagation();
        this.crudService.getById('/estudiantes', estudiante.id_estudiante).subscribe({
            next: (res) => {
                if (res.success && res.data) {
                    this.estudianteAEditar.set(res.data);
                } else {
                    toastError('No se pudieron obtener los datos del estudiante.');
                }
            },
            error: (err) => toastError(extractMessage(err, 'Error al obtener datos del estudiante'))
        });
    }

    guardarEstudiante(formData: any): void {
        const est = this.estudianteAEditar();
        if (!est) return;

        const id = est.id_estudiante;
        this.crudService.update('/estudiantes', id, formData).subscribe({
            next: (res) => {
                toastSuccess(res.message ?? 'Estudiante actualizado correctamente');
                this.estudianteAEditar.set(null);
                this.cargarEstudiantes();
                if (this.estudianteSeleccionado()?.id_estudiante === id) {
                    this.estudianteSeleccionado.update(curr => curr ? { ...curr, ...formData } : null);
                }
            },
            error: (err) => toastError(extractMessage(err, 'No se pudo actualizar el estudiante'))
        });
    }

    cerrarModalForm(): void {
        this.estudianteAEditar.set(null);
    }

    eliminarEstudiante(estudiante: EstudianteResumen, event?: Event): void {
        if (event) event.stopPropagation();
        Swal.fire({
            title: `¿Eliminar a ${estudiante.nombre}?`,
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#5D737E'
        }).then((result) => {
            if (!result.isConfirmed) return;
            this.crudService.delete('/estudiantes', estudiante.id_estudiante).subscribe({
                next: (res) => {
                    toastSuccess(res.message ?? 'Estudiante eliminado');
                    if (this.estudianteSeleccionado()?.id_estudiante === estudiante.id_estudiante) {
                        this.volver();
                    }
                    this.cargarEstudiantes();
                },
                error: (err) => toastError(extractMessage(err, 'No se pudo eliminar al estudiante'))
            });
        });
    }
}