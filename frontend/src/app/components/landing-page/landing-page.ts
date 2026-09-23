import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import {
  Proveedor,
  Ruta,
  Servicio,
  ServiciosService,
} from '../../services/servicios.service';
import {
  Valoracion,
  ValoracionDetalle,
  ValoracionesService,
} from '../../services/valoraciones.service';
import { LoginService } from '../../services/login';
import { getDashboardRoute, normalizeRole } from '../../config/role.config';

export interface ServicioLanding extends Servicio {
  proveedor?: Proveedor;
  rutas: Ruta[];
  valoraciones: ValoracionDetalle[];
  promedioValoraciones: number;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit, OnDestroy {
  private serviciosService = inject(ServiciosService);
  private valoracionesService = inject(ValoracionesService);
  private loginService = inject(LoginService);

  // Datos crudos: no se leen directo en el template, solo alimentan
  // los signals de abajo. Por eso pueden quedar como propiedades normales.
  private servicios: Servicio[] = [];
  private proveedores: Proveedor[] = [];
  private rutas: Ruta[] = [];
  private valoraciones: ValoracionDetalle[] = [];
  private serviciosLanding: ServicioLanding[] = [];

  // Todo lo que se lee en el template y puede cambiar dentro de un
  // subscribe() o un setInterval() vive en un signal, para que Angular
  // repinte la vista sin necesidad de otra acción/click que lo dispare.
  serviciosFiltrados = signal<ServicioLanding[]>([]);
  cargando = signal(true);
  errorCarga = signal(false);

  filtroNombre = '';
  precioMaximo: number | null = null;

  private calificacionPorServicio = signal<Record<number, number>>({});
  private comentarioPorServicio = signal<Record<number, string>>({});
  private enviandoValoracionServicio = signal<number | null>(null);
  private mensajeValoracion = signal<Record<number, string>>({});
  private errorValoracion = signal<Record<number, string>>({});

  // El formulario ya no se muestra permanentemente.
  private formularioValoracionAbierto = signal<Record<number, boolean>>({});
  private modoEdicionValoracion = signal<Record<number, boolean>>({});

  // Mantiene las reseñas visibles actualizadas sin recargar la página.
  private refrescoValoracionesId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    if (this.refrescoValoracionesId) {
      clearInterval(this.refrescoValoracionesId);
      this.refrescoValoracionesId = null;
    }
  }

  usuarioActual(): any {
    return this.loginService.getUser();
  }

  estaLogueado(): boolean {
    return !!this.usuarioActual();
  }

  esUsuario(): boolean {
    const usuario = this.usuarioActual();

    return !!usuario && normalizeRole(usuario.rol) === 'USUARIO';
  }

  rutaDashboard(): string {
    return getDashboardRoute(this.usuarioActual()?.rol);
  }

  rutaAccionPrincipal(): string {
    return this.estaLogueado() ? this.rutaDashboard() : '/register';
  }

  cargarDatos(): void {
    this.cargando.set(true);
    this.errorCarga.set(false);

    forkJoin({
      servicios: this.serviciosService.obtenerServicios(),
      proveedores: this.serviciosService.obtenerProveedores(),
      rutas: this.serviciosService.obtenerRutas(),
      valoracionesDetalle: this.valoracionesService.obtenerValoracionesDetalle(),
    }).subscribe({
      next: ({ servicios, proveedores, rutas, valoracionesDetalle }) => {
        this.servicios = servicios.data ?? [];
        this.proveedores = proveedores.data ?? [];
        this.rutas = rutas.data ?? [];
        this.valoraciones = valoracionesDetalle.data ?? [];
        this.construirServiciosLanding();
        this.precargarValoracionesUsuario();
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error cargando información de la landing:', error);
        this.errorCarga.set(true);
        this.cargando.set(false);
      },
    });
  }

  private recargarValoraciones(
    silencioso = false,
    alFinalizar?: () => void,
  ): void {
    this.valoracionesService.obtenerValoracionesDetalle().subscribe({
      next: (res) => {
        this.valoraciones = res.data ?? [];
        this.construirServiciosLanding();
        this.precargarValoracionesUsuario();
        alFinalizar?.();
      },
      error: (error) => {
        if (!silencioso) {
          console.error('No se pudieron refrescar las valoraciones:', error);
        }
        alFinalizar?.();
      },
    });
  }

  construirServiciosLanding(): void {
    this.serviciosLanding = this.servicios
      .filter((servicio) => servicio.estado?.toUpperCase() === 'ACTIVO')
      .map((servicio) => {
        const proveedor = this.proveedores.find(
          (item) => item.id_proveedor === servicio.id_proveedor,
        );

        const rutasServicio = this.rutas.filter(
          (ruta) =>
            ruta.id_servicio === servicio.id_servicio &&
            ruta.estado?.toUpperCase() === 'ACTIVO',
        );

        // Las reseñas ahora pertenecen al servicio, no al proveedor.
        const valoracionesServicio = this.valoraciones.filter(
          (valoracion) => valoracion.id_servicio === servicio.id_servicio,
        );

        const promedio = valoracionesServicio.length
          ? valoracionesServicio.reduce(
              (total, valoracion) => total + Number(valoracion.calificacion),
              0,
            ) / valoracionesServicio.length
          : 0;

        return {
          ...servicio,
          proveedor,
          rutas: rutasServicio,
          valoraciones: valoracionesServicio,
          promedioValoraciones: promedio,
        };
      });

    this.aplicarFiltrosActuales();
  }

  filtrarServicios(): void {
    this.aplicarFiltrosActuales();
  }

  private aplicarFiltrosActuales(): void {
    const nombre = this.filtroNombre.trim().toLowerCase();

    const filtrados = this.serviciosLanding.filter((servicio) => {
      const coincideNombre =
        !nombre || servicio.nombre.toLowerCase().includes(nombre);

      const coincidePrecio =
        this.precioMaximo === null ||
        this.precioMaximo <= 0 ||
        Number(servicio.precio_mensual) <= this.precioMaximo;

      return coincideNombre && coincidePrecio;
    });

    this.serviciosFiltrados.set(filtrados);
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.precioMaximo = null;
    this.aplicarFiltrosActuales();
  }

  obtenerEstrellas(calificacion: number): number[] {
    const cantidad = Math.max(0, Math.min(5, Math.round(calificacion)));
    return Array(cantidad).fill(0);
  }

  estrellasSelector(): number[] {
    return [1, 2, 3, 4, 5];
  }

  seleccionarCalificacion(idServicio: number, calificacion: number): void {
    const valor = Math.max(0, Math.min(5, calificacion));

    this.calificacionPorServicio.update((actual) => ({
      ...actual,
      [idServicio]: valor,
    }));
    this.actualizarMensaje(idServicio, '');
    this.actualizarError(idServicio, '');
  }

  calificacionServicio(idServicio: number): number {
    return this.calificacionPorServicio()[idServicio] ?? 0;
  }

  comentarioServicio(idServicio: number): string {
    return this.comentarioPorServicio()[idServicio] ?? '';
  }

  actualizarComentario(idServicio: number, valor: string): void {
    this.comentarioPorServicio.update((actual) => ({
      ...actual,
      [idServicio]: valor,
    }));
  }

  private actualizarMensaje(idServicio: number, mensaje: string): void {
    this.mensajeValoracion.update((actual) => ({
      ...actual,
      [idServicio]: mensaje,
    }));
  }

  private actualizarError(idServicio: number, mensaje: string): void {
    this.errorValoracion.update((actual) => ({
      ...actual,
      [idServicio]: mensaje,
    }));
  }

  private actualizarFormularioAbierto(idServicio: number, abierto: boolean): void {
    this.formularioValoracionAbierto.update((actual) => ({
      ...actual,
      [idServicio]: abierto,
    }));
  }

  private actualizarModoEdicion(idServicio: number, edicion: boolean): void {
    this.modoEdicionValoracion.update((actual) => ({
      ...actual,
      [idServicio]: edicion,
    }));
  }

  formularioAbierto(idServicio: number): boolean {
    return !!this.formularioValoracionAbierto()[idServicio];
  }

  enEdicion(idServicio: number): boolean {
    return !!this.modoEdicionValoracion()[idServicio];
  }

  mensajeDeServicio(idServicio: number): string {
    return this.mensajeValoracion()[idServicio] ?? '';
  }

  errorDeServicio(idServicio: number): string {
    return this.errorValoracion()[idServicio] ?? '';
  }

  enviando(idServicio: number): boolean {
    return this.enviandoValoracionServicio() === idServicio;
  }

  idUsuarioActual(): number | null {
    const value =
      this.usuarioActual()?.id_usuario ??
      this.usuarioActual()?.id;

    const id = Number(value);
    return Number.isFinite(id) && id > 0 ? id : null;
  }

  valoracionPropia(
    servicio: ServicioLanding,
  ): ValoracionDetalle | undefined {
    const idUsuario = this.idUsuarioActual();

    if (!idUsuario) return undefined;

    return servicio.valoraciones.find(
      (valoracion) => Number(valoracion.id_usuario) === idUsuario,
    );
  }

  esValoracionPropia(valoracion: ValoracionDetalle): boolean {
    const idUsuario = this.idUsuarioActual();

    return !!idUsuario &&
      Number(valoracion.id_usuario) === idUsuario;
  }

  abrirFormularioNuevaValoracion(servicio: ServicioLanding): void {
    if (!this.esUsuario() || this.valoracionPropia(servicio)) return;

    const idServicio = servicio.id_servicio;

    this.calificacionPorServicio.update((actual) => ({
      ...actual,
      [idServicio]: 0,
    }));
    this.actualizarComentario(idServicio, '');
    this.actualizarFormularioAbierto(idServicio, true);
    this.actualizarModoEdicion(idServicio, false);
    this.actualizarMensaje(idServicio, '');
    this.actualizarError(idServicio, '');
  }

  abrirEdicionValoracion(
    servicio: ServicioLanding,
    valoracion: ValoracionDetalle,
  ): void {
    if (!this.esUsuario() || !this.esValoracionPropia(valoracion)) return;

    const idServicio = servicio.id_servicio;

    this.calificacionPorServicio.update((actual) => ({
      ...actual,
      [idServicio]: Number(valoracion.calificacion) || 0,
    }));
    this.actualizarComentario(idServicio, valoracion.comentario ?? '');
    this.actualizarFormularioAbierto(idServicio, true);
    this.actualizarModoEdicion(idServicio, true);
    this.actualizarMensaje(idServicio, '');
    this.actualizarError(idServicio, '');
  }

  cerrarFormularioValoracion(servicio: ServicioLanding): void {
    const idServicio = servicio.id_servicio;

    this.actualizarFormularioAbierto(idServicio, false);
    this.actualizarModoEdicion(idServicio, false);
    this.actualizarError(idServicio, '');

    const propia = this.valoracionPropia(servicio);

    if (propia) {
      this.calificacionPorServicio.update((actual) => ({
        ...actual,
        [idServicio]: Number(propia.calificacion) || 0,
      }));
      this.actualizarComentario(idServicio, propia.comentario ?? '');
    } else {
      this.calificacionPorServicio.update((actual) => ({
        ...actual,
        [idServicio]: 0,
      }));
      this.actualizarComentario(idServicio, '');
    }
  }

  guardarValoracion(servicio: ServicioLanding): void {
    if (!this.esUsuario()) return;

    const idServicio = servicio.id_servicio;
    const calificacion = this.calificacionServicio(idServicio);
    const comentario = this.comentarioServicio(idServicio).trim();
    const editando = this.enEdicion(idServicio);

    this.enviandoValoracionServicio.set(idServicio);
    this.actualizarMensaje(idServicio, '');
    this.actualizarError(idServicio, '');

    this.valoracionesService
      .valorarServicio(idServicio, {
        comentario: comentario || null,
        calificacion,
      })
      .subscribe({
        next: (res) => {
          this.actualizarMensaje(
            idServicio,
            res.message ||
              (editando
                ? 'Valoración actualizada correctamente.'
                : 'Valoración publicada correctamente.'),
          );

          // Se vuelve a consultar el detalle y solo después se cierra el
          // formulario. Así la tarjeta cambia inmediatamente sin F5.
          this.recargarValoraciones(false, () => {
            this.enviandoValoracionServicio.set(null);
            this.actualizarFormularioAbierto(idServicio, false);
            this.actualizarModoEdicion(idServicio, false);
          });
        },
        error: (error) => {
          this.enviandoValoracionServicio.set(null);
          this.actualizarError(
            idServicio,
            error?.error?.message ||
              error?.error?.error ||
              'No se pudo guardar la valoración.',
          );
        },
      });
  }

  private precargarValoracionesUsuario(): void {
    const idUsuario = this.idUsuarioActual();

    if (!idUsuario || !this.esUsuario()) return;

    for (const valoracion of this.valoraciones) {
      if (valoracion.id_usuario !== idUsuario) continue;

      this.calificacionPorServicio.update((actual) => ({
        ...actual,
        [valoracion.id_servicio]: Number(valoracion.calificacion),
      }));
      this.actualizarComentario(
        valoracion.id_servicio,
        valoracion.comentario ?? '',
      );
    }
  }

  obtenerUsuarioValoracion(
    idValoracion: number,
  ): ValoracionDetalle | undefined {
    return this.valoraciones.find(
      (valoracion) => valoracion.id_valoracion === idValoracion,
    );
  }
}