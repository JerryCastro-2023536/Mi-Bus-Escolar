import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginService } from '../../services/login';
import { UsuarioViewService } from '../../services/usuario-view.service';
import { CrudService } from '../../services/crud.service';
import { FormComponent } from '../crud-view/form/form';
import { estudiantesConfig } from '../../models/estudiantes.model';
import Swal from 'sweetalert2';
import { toastSuccess, toastError, extractMessage } from '../../helpers/swal-toast';

import { EstudianteResumen } from '../../models/pago.model';
import { FormField } from '../../models/crudDTO.interface';

interface ColegioOption {
    id_colegio: number;
    nombre: string;
}

@Component({
    selector: 'app-mis-estudiantes',
    standalone: true,
    imports: [CommonModule, FormComponent],
    templateUrl: './mis-estudiantes.html',
    styleUrl: './mis-estudiantes.css'
})
export class MisEstudiantes implements OnInit {

    private loginService = inject(LoginService);
    private usuarioViewService = inject(UsuarioViewService);
    private crudService = inject(CrudService);

    estudiantes = signal<EstudianteResumen[]>([]);
    cargando = signal(false);
    mensajeError = '';
    colegios = signal<ColegioOption[]>([]);
    mostrarFormulario = signal(false);
    modoEdicion = signal(false);

    estudianteAEditar = signal<any | null>(null);
    formFields: FormField[] = [];

    ngOnInit(): void {
        this.cargarColegios();
        this.cargarEstudiantes();
    }

    private buildFormFields(): FormField[] {
        const baseFields: FormField[] = this.modoEdicion()
            ? [...(estudiantesConfig.formFieldsEdit ?? [])] as FormField[]
            : [...(estudiantesConfig.formFields ?? [])] as FormField[];

        return baseFields
            .filter((field) => field.key !== 'id_usuario_tutor')
            .map((field: FormField): FormField => {
                if (field.key !== 'id_colegio') {
                    return { ...field };
                }

                return {
                    ...field,
                    required: false,
                    type: 'select',
                    options: [
                        { value: '', label: 'Sin colegio asignado' },
                        ...this.colegios().map((colegio) => ({
                            value: colegio.id_colegio,
                            label: colegio.nombre
                        }))
                    ]
                };
            });
    }

    cargarColegios(): void {
        this.crudService.getAll<ColegioOption>('/colegios').subscribe({
            next: (res) => {
                const lista = (res?.data ?? []) as ColegioOption[];
                this.colegios.set(lista);
                this.formFields = this.buildFormFields();
            },
            error: () => {
                this.colegios.set([]);
                this.formFields = this.buildFormFields();
            }
        });
    }

    cargarEstudiantes(): void {
        const sesion = this.loginService.getUser();
        const idUsuario = sesion?.id_usuario ?? sesion?.id;

        if (!idUsuario) {
            this.mensajeError = 'No se pudo identificar al usuario.';
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
                    this.mensajeError = 'No se pudieron cargar los estudiantes.';
                }
            });
    }

    abrirFormularioCrear(): void {
        this.modoEdicion.set(false);
        this.estudianteAEditar.set(null);
        this.formFields = this.buildFormFields();
        this.mostrarFormulario.set(true);
    }

    editarEstudiante(estudiante: EstudianteResumen): void {
        this.crudService.getById('/estudiantes', estudiante.id_estudiante).subscribe({
            next: (res) => {
                if (res.success && res.data) {
                    this.modoEdicion.set(true);
                    this.estudianteAEditar.set(res.data);
                    this.formFields = this.buildFormFields();
                    this.mostrarFormulario.set(true);
                } else {
                    toastError('No se pudieron obtener los datos del estudiante.');
                }
            },
            error: (err) => toastError(extractMessage(err, 'Error al obtener datos del estudiante'))
        });
    }

   guardarEstudiante(formData: any): void {
    const sesion = this.loginService.getUser();
    const idUsuarioTutor = sesion?.id_usuario ?? sesion?.id;

    const payload = {
        ...formData,
        id_usuario_tutor: idUsuarioTutor,
        id_colegio: formData.id_colegio ? Number(formData.id_colegio) : null,
        grado: formData.grado?.trim() ? formData.grado.trim() : undefined
    };

    const est = this.estudianteAEditar();

    if (this.modoEdicion() && est) {
        const id = est.id_estudiante;
        this.crudService.update('/estudiantes', id, payload).subscribe({
            next: (res) => {
                toastSuccess(res.message ?? 'Estudiante actualizado correctamente');
                this.cerrarModalForm();
                this.cargarEstudiantes();
            },
            error: (err) => toastError(extractMessage(err, 'No se pudo actualizar el estudiante'))
        });
        return;
    }

    this.crudService.create('/estudiantes', payload).subscribe({
        next: (res) => {
            toastSuccess(res.message ?? 'Estudiante creado correctamente');
            this.cerrarModalForm();
            this.cargarEstudiantes();
        },
        error: (err) => toastError(extractMessage(err, 'No se pudo crear el estudiante'))
    });
}

    cerrarModalForm(): void {
        this.mostrarFormulario.set(false);
        this.modoEdicion.set(false);
        this.estudianteAEditar.set(null);
    }

    eliminarEstudiante(estudiante: EstudianteResumen): void {
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
                    this.cargarEstudiantes();
                },
                error: (err) => toastError(extractMessage(err, 'No se pudo eliminar al estudiante'))
            });
        });
    }
}