import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginService } from '../../services/login';
import { UsuarioViewService, AsignacionEstudiante } from '../../services/usuario-view.service';
import { CrudService } from '../../services/crud.service';
import { FormComponent } from '../crud-view/form/form';
import { MapaComponent } from '../mapa/mapa.component';
import { PuntoRuta } from '../../models/mapas.type';
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
    imports: [CommonModule, FormComponent, MapaComponent],
    templateUrl: './viajes-usuario.html',
    styleUrl: './viajes-usuario.css'
})
export class ViajesUsuario implements OnInit, OnDestroy {

    private loginService = inject(LoginService);
    private usuarioViewService = inject(UsuarioViewService);
    private crudService = inject(CrudService);

    estudiantes = signal<EstudianteResumen[]>([]);
    estudianteSeleccionado = signal<EstudianteResumen | null>(null);
    viajes = signal<ViajeUsuario[]>([]);
    filtroEstado = signal<FiltroEstadoViaje>('TODOS');

    asignacionEstudiante = signal<AsignacionEstudiante | null>(null);
    sinRutaAsignada = signal(false);

    cargandoEstudiantes = signal(false);
    cargandoViajes = signal(false);
    mensajeError = '';

    modalRastreoAbierto = signal(false);
    viajeSeleccionado = signal<ViajeUsuario | null>(null);
    trazadoRuta = signal<PuntoRuta[]>([]);
    posicionChofer = signal<PuntoRuta | undefined>(undefined);
    cargandoMapa = signal(false);
    private intervaloRastreo: any = null;

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
        this.sinRutaAsignada.set(false);
        this.asignacionEstudiante.set(null);
        this.cargandoViajes.set(true);

        // Primero verificar si el estudiante tiene una ruta asignada
        this.usuarioViewService
            .obtenerAsignacionEstudiante(estudiante.id_estudiante)
            .subscribe({
                next: (asignacion) => {
                    this.asignacionEstudiante.set(asignacion);

                    if (!asignacion || !asignacion.id_ruta) {
                        // El estudiante NO tiene ruta asignada
                        this.sinRutaAsignada.set(true);
                        this.cargandoViajes.set(false);
                        return;
                    }

                    // Tiene ruta asignada, cargar viajes
                    this.cargarViajesEstudiante(estudiante.id_estudiante);
                },
                error: () => {
                    this.cargandoViajes.set(false);
                    this.mensajeError = 'No se pudo verificar la asignación del estudiante.';
                }
            });
    }

    private cargarViajesEstudiante(idEstudiante: number): void {
        this.usuarioViewService
            .listarTodosViajesPorEstudiante(idEstudiante)
            .subscribe({
                next: (data) => {
                    // Ordenar del más reciente al más antiguo
                    const ordenados = data.sort((a, b) => {
                        // Primero por fecha descendente
                        const fechaA = new Date(a.fecha_viaje).getTime();
                        const fechaB = new Date(b.fecha_viaje).getTime();
                        if (fechaB !== fechaA) return fechaB - fechaA;
                        // Si misma fecha, por id_viaje descendente
                        return b.id_viaje - a.id_viaje;
                    });
                    this.viajes.set(ordenados);
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
        this.sinRutaAsignada.set(false);
        this.asignacionEstudiante.set(null);
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

    // --- Lógica del Mapa en Vivo para Tutor / Usuario ---

    abrirModalRastreo(v: ViajeUsuario): void {
        this.viajeSeleccionado.set(v);
        this.modalRastreoAbierto.set(true);
        this.cargandoMapa.set(true);

        if (v.id_viaje) {
            this.usuarioViewService.obtenerTrazadoActivoViaje(v.id_viaje, v.id_ruta).subscribe({
                next: (puntos) => {
                    if (puntos && puntos.length > 0) {
                        this.trazadoRuta.set(puntos);
                    } else if (v.id_ruta) {
                        this.usuarioViewService.obtenerTrazadoRuta(v.id_ruta).subscribe({
                            next: (pts) => this.trazadoRuta.set(pts || []),
                            error: () => this.trazadoRuta.set([])
                        });
                    }
                    this.cargandoMapa.set(false);
                },
                error: () => {
                    if (v.id_ruta) {
                        this.usuarioViewService.obtenerTrazadoRuta(v.id_ruta).subscribe({
                            next: (pts) => this.trazadoRuta.set(pts || []),
                            error: () => this.trazadoRuta.set([])
                        });
                    }
                    this.cargandoMapa.set(false);
                }
            });
        } else if (v.id_ruta) {
            this.usuarioViewService.obtenerTrazadoRuta(v.id_ruta).subscribe({
                next: (puntos) => {
                    this.trazadoRuta.set(puntos || []);
                    this.cargandoMapa.set(false);
                },
                error: () => {
                    this.trazadoRuta.set([]);
                    this.cargandoMapa.set(false);
                }
            });
        } else {
            this.trazadoRuta.set([]);
            this.cargandoMapa.set(false);
        }

        this.actualizarGPSChofer(v.id_viaje);

        this.detenerSondeo();
        this.intervaloRastreo = setInterval(() => {
            this.actualizarGPSChofer(v.id_viaje);
        }, 4000);
    }

    private actualizarGPSChofer(idViaje: number): void {
        this.usuarioViewService.obtenerUbicacionActualViaje(idViaje).subscribe({
            next: (data: any) => {
                if (data && data.latitud && data.longitud) {
                    this.posicionChofer.set({
                        lat: Number(data.latitud),
                        lng: Number(data.longitud)
                    });
                }
                if (data && data.trazado_activo && Array.isArray(data.trazado_activo) && data.trazado_activo.length > 0) {
                    this.trazadoRuta.set(data.trazado_activo);
                }
            },
            error: (err) => {
                console.warn('Error consultando GPS del chofer para el usuario:', err);
            }
        });
    }

    cerrarModalRastreo(): void {
        this.detenerSondeo();
        this.modalRastreoAbierto.set(false);
        this.viajeSeleccionado.set(null);
        this.posicionChofer.set(undefined);
        this.trazadoRuta.set([]);
    }

    private detenerSondeo(): void {
        if (this.intervaloRastreo) {
            clearInterval(this.intervaloRastreo);
            this.intervaloRastreo = null;
        }
    }

    ngOnDestroy(): void {
        this.detenerSondeo();
    }
}