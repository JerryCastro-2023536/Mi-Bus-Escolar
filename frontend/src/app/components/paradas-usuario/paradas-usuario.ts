import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, switchMap } from 'rxjs';

import { LoginService } from '../../services/login';
import { UsuarioViewService, AsignacionEstudiante } from '../../services/usuario-view.service';
import { EstudianteResumen } from '../../models/pago.model';
import { PuntoRuta } from '../../models/mapas.type';
import { MapaComponent } from '../mapa/mapa.component';

@Component({
    selector: 'app-paradas-usuario',
    standalone: true,
    imports: [CommonModule, FormsModule, MapaComponent],
    templateUrl: './paradas-usuario.html',
    styleUrl: './paradas-usuario.css'
})
export class ParadasUsuario implements OnInit {

    private loginService = inject(LoginService);
    private usuarioViewService = inject(UsuarioViewService);

    estudiantes = signal<EstudianteResumen[]>([]);
    estudianteSeleccionado = signal<EstudianteResumen | null>(null);
    asignacion = signal<AsignacionEstudiante | null>(null);
    paradasRuta = signal<any[]>([]);
    todasParadas = signal<any[]>([]);

    cargando = signal(false);
    cargandoAsignacion = signal(false);
    guardando = signal(false);

    mensajeError = '';
    mensajeExito = '';

    // Modal agregar parada
    mostrarModalAgregar = signal(false);
    pasoModal = signal<'mapa' | 'formulario'>('mapa');

    ubicacionSeleccionada = signal<PuntoRuta | null>(null);
    nombreParada = '';
    direccionParada = '';
    tipoParada: 'recogida' | 'descenso' = 'recogida';
    errorModal = '';

    ngOnInit(): void {
        this.cargarEstudiantes();
    }

    private cargarEstudiantes(): void {
        const sesion = this.loginService.getUser();
        const idUsuario = sesion?.id_usuario ?? sesion?.id;

        if (!idUsuario) {
            this.mensajeError = 'No se pudo identificar al usuario.';
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
                    this.mensajeError = 'No se pudieron cargar los estudiantes.';
                }
            });
    }

    seleccionarEstudiante(estudiante: EstudianteResumen): void {
        this.estudianteSeleccionado.set(estudiante);
        this.asignacion.set(null);
        this.paradasRuta.set([]);
        this.todasParadas.set([]);
        this.mensajeError = '';
        this.mensajeExito = '';
        this.cargarAsignacion(estudiante.id_estudiante);
    }

    private cargarAsignacion(idEstudiante: number): void {
        this.cargandoAsignacion.set(true);

        this.usuarioViewService
            .obtenerAsignacionEstudiante(idEstudiante)
            .subscribe({
                next: (asignacion) => {
                    this.asignacion.set(asignacion);
                    if (asignacion?.id_ruta) {
                        this.cargarParadas(asignacion.id_ruta);
                    } else {
                        this.cargandoAsignacion.set(false);
                    }
                },
                error: () => {
                    this.cargandoAsignacion.set(false);
                }
            });
    }

    private cargarParadas(idRuta: number): void {
        forkJoin({
            paradasRuta: this.usuarioViewService.obtenerParadasDeRuta(idRuta),
            todasParadas: this.usuarioViewService.listarTodasParadas()
        }).subscribe({
            next: ({ paradasRuta, todasParadas }) => {
                this.paradasRuta.set(paradasRuta);
                this.todasParadas.set(todasParadas);
                this.cargandoAsignacion.set(false);
            },
            error: () => {
                this.cargandoAsignacion.set(false);
            }
        });
    }

    volver(): void {
        this.estudianteSeleccionado.set(null);
        this.asignacion.set(null);
        this.paradasRuta.set([]);
        this.todasParadas.set([]);
        this.mensajeError = '';
        this.mensajeExito = '';
    }

    // ── MODAL AGREGAR PARADA ──────────────────────

    abrirModalAgregar(tipo: 'recogida' | 'descenso' = 'recogida'): void {
        this.pasoModal.set('mapa');
        this.tipoParada = tipo;
        this.errorModal = '';

        const paradaExistente = tipo === 'recogida' ? this.getParadaRecogida() : this.getParadaDescenso();
        if (paradaExistente && paradaExistente.latitud != null && paradaExistente.longitud != null) {
            this.ubicacionSeleccionada.set({
                lat: Number(paradaExistente.latitud),
                lng: Number(paradaExistente.longitud)
            });
            this.nombreParada = paradaExistente.nombre || '';
            this.direccionParada = paradaExistente.direccion || '';
        } else {
            this.ubicacionSeleccionada.set(null);
            this.nombreParada = '';
            this.direccionParada = '';
        }

        this.mostrarModalAgregar.set(true);
    }

    cerrarModalAgregar(): void {
        this.mostrarModalAgregar.set(false);
    }

    cambiarTipoParada(nuevoTipo: 'recogida' | 'descenso'): void {
        this.tipoParada = nuevoTipo;
    }

    onUbicacionCambiada(punto: PuntoRuta): void {
        this.ubicacionSeleccionada.set(punto);
    }

    continuarAFormulario(): void {
        if (!this.ubicacionSeleccionada()) {
            this.errorModal = 'Por favor selecciona un punto en el mapa.';
            return;
        }
        this.errorModal = '';
        this.pasoModal.set('formulario');
    }

    volverAlMapa(): void {
        this.pasoModal.set('mapa');
        this.errorModal = '';
    }

    guardarParada(): void {
        const ubicacion = this.ubicacionSeleccionada();
        const asignacion = this.asignacion();

        if (!ubicacion) {
            this.errorModal = 'No hay ubicación seleccionada.';
            return;
        }

        if (!this.nombreParada.trim()) {
            this.errorModal = 'El nombre de la parada es requerido.';
            return;
        }

        if (!this.direccionParada.trim()) {
            this.errorModal = 'La dirección es requerida.';
            return;
        }

        if (!asignacion?.id_ruta) {
            this.errorModal = 'El estudiante no tiene una ruta asignada.';
            return;
        }

        this.guardando.set(true);
        this.errorModal = '';

        const tipo = this.tipoParada;
        const idEstudiante = asignacion.id_estudiante;
        const idAsignacion = asignacion.id_asignacion;

        const idParadaExistente = tipo === 'recogida'
            ? asignacion.id_parada_recogida
            : asignacion.id_parada_descenso;

        const otraParadaId = tipo === 'recogida'
            ? asignacion.id_parada_descenso
            : asignacion.id_parada_recogida;

        // Si ya existe una parada asignada a este tipo y es exclusiva (no compartida con la otra dirección):
        if (idParadaExistente && Number(idParadaExistente) !== Number(otraParadaId)) {
            // Sobrescribe directamente la parada existente
            this.usuarioViewService.editarParada(Number(idParadaExistente), {
                nombre: this.nombreParada.trim(),
                direccion: this.direccionParada.trim(),
                latitud: ubicacion.lat,
                longitud: ubicacion.lng
            }).subscribe({
                next: () => {
                    this.guardando.set(false);
                    this.cerrarModalAgregar();
                    this.mensajeExito = `Parada de ${tipo === 'recogida' ? 'subida' : 'descenso'} actualizada correctamente.`;
                    this.cargarAsignacion(idEstudiante);
                    setTimeout(() => { this.mensajeExito = ''; }, 5000);
                },
                error: (err) => {
                    this.guardando.set(false);
                    this.errorModal = 'Error al actualizar la parada. Por favor intenta de nuevo.';
                    console.error(err);
                }
            });
        } else {
            // Crea una nueva parada, la vincula a la ruta y actualiza la asignación del estudiante
            const siguienteOrden = (this.paradasRuta().length || 0) + 1;
            this.usuarioViewService
                .crearParada({
                    nombre: this.nombreParada.trim(),
                    direccion: this.direccionParada.trim(),
                    latitud: ubicacion.lat,
                    longitud: ubicacion.lng
                })
                .pipe(
                    switchMap(paradaCreada => {
                        const agregarARuta$ = this.usuarioViewService.agregarParadaARuta({
                            id_ruta: asignacion.id_ruta,
                            id_parada: paradaCreada.id_parada,
                            orden_parada: siguienteOrden
                        });

                        if (idAsignacion) {
                            const payloadAsig = {
                                id_estudiante: asignacion.id_estudiante,
                                id_ruta: asignacion.id_ruta,
                                id_parada_recogida: tipo === 'recogida'
                                    ? paradaCreada.id_parada
                                    : (asignacion.id_parada_recogida ? Number(asignacion.id_parada_recogida) : null),
                                id_parada_descenso: tipo === 'descenso'
                                    ? paradaCreada.id_parada
                                    : (asignacion.id_parada_descenso ? Number(asignacion.id_parada_descenso) : null)
                            };
                            return agregarARuta$.pipe(
                                switchMap(() => this.usuarioViewService.actualizarAsignacion(idAsignacion, payloadAsig))
                            );
                        }

                        return agregarARuta$;
                    })
                )
                .subscribe({
                    next: () => {
                        this.guardando.set(false);
                        this.cerrarModalAgregar();
                        this.mensajeExito = `Parada de ${tipo === 'recogida' ? 'subida' : 'descenso'} configurada correctamente.`;
                        this.cargarAsignacion(idEstudiante);
                        setTimeout(() => { this.mensajeExito = ''; }, 5000);
                    },
                    error: (err) => {
                        this.guardando.set(false);
                        this.errorModal = 'Error al guardar la parada. Por favor intenta de nuevo.';
                        console.error(err);
                    }
                });
        }
    }

    getParadaRecogida(): any {
        const asig = this.asignacion();
        if (!asig?.id_parada_recogida) return null;
        const id = Number(asig.id_parada_recogida);
        return this.paradasRuta().find(p => Number(p.id_parada) === id)
            || this.todasParadas().find(p => Number(p.id_parada) === id)
            || null;
    }

    getParadaDescenso(): any {
        const asig = this.asignacion();
        if (!asig?.id_parada_descenso) return null;
        const id = Number(asig.id_parada_descenso);
        return this.paradasRuta().find(p => Number(p.id_parada) === id)
            || this.todasParadas().find(p => Number(p.id_parada) === id)
            || null;
    }
}