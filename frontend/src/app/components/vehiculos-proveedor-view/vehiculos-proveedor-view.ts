import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { LoginService } from '../../services/login';
import { CloudinaryService } from '../../services/cloudinary.service';
import { ProveedorOperacionesService } from '../../services/proveedorOperaciones.service';
import { VehiculosProveedorService } from '../../services/vehiculosProveedor.service';
import {
  EstadoVehiculo,
  RutaVehiculo,
  VehiculoProveedor,
} from '../../models/vehiculoProveedor.interface';
import { ProveedorRutaResumen } from '../../models/proveedor-operaciones.model';

@Component({
  selector: 'app-vehiculos-proveedor-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculos-proveedor-view.html',
  styleUrls: ['./vehiculos-proveedor-view.css', '../proveedor-operaciones.css'],
})
export class VehiculosProveedorView implements OnInit {
  private loginService = inject(LoginService);
  private vehiculosService = inject(VehiculosProveedorService);
  private cloudinaryService = inject(CloudinaryService);
  private api = inject(ProveedorOperacionesService);

  vehiculos = signal<VehiculoProveedor[]>([]);
  rutas = signal<ProveedorRutaResumen[]>([]);
  cargando = signal(false);

  mensajeError = '';
  mensajeExito = '';

  modalAbierto = signal(false);
  modoEdicion = signal(false);
  vehiculoEditando = signal<VehiculoProveedor | null>(null);
  placaForm = '';
  estadoForm: EstadoVehiculo = 'ACTIVO';
  fotoUrlForm: string | null = null;
  subiendoFoto = signal(false);
  guardando = signal(false);
  errorModal = '';

  vehiculoAEliminar = signal<VehiculoProveedor | null>(null);
  eliminando = signal(false);

  modalRuta = signal<VehiculoProveedor | null>(null);
  ruta = 0;
  rutasSeleccionadas = signal<number[]>([]);
  confirmarQuitarRutas = signal(false);
  vehiculoRutasPendientes: RutaVehiculo[] = [];
  asignandoRuta = signal(false);
  quitandoRutas = signal(false);
  errorRuta = '';

  ngOnInit(): void {
    this.cargar();
  }

  private obtenerIdUsuario(): number | null {
    const sesion = this.loginService.getUser();
    return sesion?.id_usuario ?? sesion?.id ?? null;
  }

  private extraerMensajeError(err: any, fallback: string): string {
    const errores = err?.error?.errors;
    if (Array.isArray(errores) && errores.length && errores[0]?.mensaje) {
      return errores[0].mensaje;
    }
    return err?.error?.message ?? fallback;
  }

  private convertirRuta(r: ProveedorRutaResumen): RutaVehiculo {
    return {
      id_ruta: r.id_ruta,
      nombre_ruta: r.nombre,
      id_servicio: r.id_servicio,
      nombre_servicio: r.nombre_servicio,
      id_chofer: r.id_chofer,
      nombre_chofer: r.nombre_chofer,
      apellido_chofer: r.apellido_chofer,
    };
  }

  private hidratarVehiculos(
    vehiculos: VehiculoProveedor[],
    rutas: ProveedorRutaResumen[],
  ): VehiculoProveedor[] {
    return vehiculos.map((vehiculo) => ({
      ...vehiculo,
      rutas: rutas
        .filter((ruta) => Number(ruta.id_vehiculo) === Number(vehiculo.id_vehiculo))
        .map((ruta) => this.convertirRuta(ruta)),
    }));
  }

  private cargar(): void {
    const idUsuario = this.obtenerIdUsuario();
    if (!idUsuario) return;

    this.cargando.set(true);
    this.mensajeError = '';

    forkJoin({
      rutas: this.api.rutas(idUsuario),
      vehiculos: this.vehiculosService.listar(idUsuario),
    }).subscribe({
      next: ({ rutas, vehiculos }) => {
        this.rutas.set(rutas);
        this.vehiculos.set(this.hidratarVehiculos(vehiculos, rutas));
        this.cargando.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
        this.mensajeError = this.extraerMensajeError(
          err,
          'No se pudo cargar la información de tus vehículos.',
        );
      },
    });
  }

  private cargarVehiculos(): void {
    const idUsuario = this.obtenerIdUsuario();
    if (!idUsuario) return;

    forkJoin({
      rutas: this.api.rutas(idUsuario),
      vehiculos: this.vehiculosService.listar(idUsuario),
    }).subscribe({
      next: ({ rutas, vehiculos }) => {
        this.rutas.set(rutas);
        this.vehiculos.set(this.hidratarVehiculos(vehiculos, rutas));
      },
      error: (err) => {
        this.mensajeError = this.extraerMensajeError(
          err,
          'No se pudieron cargar tus vehículos.',
        );
      },
    });
  }

  abrirModalNuevo(): void {
    this.modoEdicion.set(false);
    this.vehiculoEditando.set(null);
    this.placaForm = '';
    this.estadoForm = 'ACTIVO';
    this.fotoUrlForm = null;
    this.errorModal = '';
    this.modalAbierto.set(true);
  }

  abrirModalEditar(veh: VehiculoProveedor): void {
    this.modoEdicion.set(true);
    this.vehiculoEditando.set(veh);
    this.placaForm = veh.placa;
    this.estadoForm = veh.estado;
    this.fotoUrlForm = veh.foto_vehiculo;
    this.errorModal = '';
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    if (this.guardando() || this.subiendoFoto()) return;
    this.modalAbierto.set(false);
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    this.errorModal = '';
    this.subiendoFoto.set(true);
    this.cloudinaryService.upload(archivo, 'vehiculos').subscribe({
      next: (url) => {
        this.fotoUrlForm = url;
        this.subiendoFoto.set(false);
      },
      error: (err) => {
        this.subiendoFoto.set(false);
        this.errorModal = this.extraerMensajeError(
          err,
          'No se pudo subir la foto. Intenta de nuevo.',
        );
      },
    });
    input.value = '';
  }

  guardarVehiculo(): void {
    const idUsuario = this.obtenerIdUsuario();
    if (!idUsuario) return;

    const placa = this.placaForm.trim();
    if (!placa) {
      this.errorModal = 'La placa es obligatoria.';
      return;
    }

    this.guardando.set(true);
    this.errorModal = '';

    const editando = this.modoEdicion();
    const vehiculoActual = this.vehiculoEditando();

    const alTerminar = () => {
      this.guardando.set(false);
      this.modalAbierto.set(false);
      this.mensajeExito = editando
        ? 'Vehículo actualizado correctamente.'
        : 'Vehículo registrado correctamente.';
      this.cargarVehiculos();
    };

    const alFallar = (err: any) => {
      this.guardando.set(false);
      this.errorModal = this.extraerMensajeError(
        err,
        'Ocurrió un error al guardar el vehículo.',
      );
    };

    if (editando && vehiculoActual) {
      this.vehiculosService
        .actualizar(idUsuario, vehiculoActual.id_vehiculo, {
          placa,
          foto_vehiculo: this.fotoUrlForm,
          estado: this.estadoForm,
        })
        .subscribe({ next: alTerminar, error: alFallar });
    } else {
      this.vehiculosService
        .registrar(idUsuario, {
          placa,
          foto_vehiculo: this.fotoUrlForm,
        })
        .subscribe({ next: alTerminar, error: alFallar });
    }
  }

  pedirConfirmacionEliminar(veh: VehiculoProveedor): void {
    this.vehiculoAEliminar.set(veh);
  }

  cancelarEliminar(): void {
    if (this.eliminando()) return;
    this.vehiculoAEliminar.set(null);
  }

  confirmarEliminar(): void {
    const idUsuario = this.obtenerIdUsuario();
    const veh = this.vehiculoAEliminar();
    if (!idUsuario || !veh) return;

    this.eliminando.set(true);
    this.vehiculosService.eliminar(idUsuario, veh.id_vehiculo).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.vehiculoAEliminar.set(null);
        this.mensajeExito = 'Vehículo eliminado correctamente.';
        this.cargar();
      },
      error: (err) => {
        this.eliminando.set(false);
        this.vehiculoAEliminar.set(null);
        this.mensajeError = this.extraerMensajeError(
          err,
          'No se pudo eliminar el vehículo.',
        );
      },
    });
  }

  choferesDe(veh: VehiculoProveedor): { id_chofer: number; nombre: string; rutas: string }[] {
    const porChofer = new Map<
      number,
      { id_chofer: number; nombre: string; rutas: string[] }
    >();

    for (const r of veh.rutas ?? []) {
      if (!r.id_chofer) continue;

      const existente = porChofer.get(r.id_chofer);
      if (existente) {
        existente.rutas.push(r.nombre_ruta);
      } else {
        porChofer.set(r.id_chofer, {
          id_chofer: r.id_chofer,
          nombre: `${r.nombre_chofer ?? ''} ${r.apellido_chofer ?? ''}`.trim(),
          rutas: [r.nombre_ruta],
        });
      }
    }

    return [...porChofer.values()].map((c) => ({
      id_chofer: c.id_chofer,
      nombre: c.nombre || 'Chofer sin nombre',
      rutas: c.rutas.join(', '),
    }));
  }

  abrirAsignarRuta(veh: VehiculoProveedor): void {
    this.errorRuta = '';
    this.ruta = 0;
    this.rutasSeleccionadas.set([]);
    this.confirmarQuitarRutas.set(false);
    this.vehiculoRutasPendientes = [];
    this.modalRuta.set(veh);
  }

  cerrarAsignarRuta(): void {
    if (!this.asignandoRuta() && !this.quitandoRutas()) {
      this.modalRuta.set(null);
      this.rutasSeleccionadas.set([]);
    }
  }

  toggleRutaSeleccionada(idRuta: number): void {
    const actual = this.rutasSeleccionadas();
    this.rutasSeleccionadas.set(
      actual.includes(idRuta)
        ? actual.filter((id) => id !== idRuta)
        : [...actual, idRuta],
    );
  }

  rutaSeleccionada(idRuta: number): boolean {
    return this.rutasSeleccionadas().includes(idRuta);
  }

  abrirConfirmarQuitarRutas(): void {
    const veh = this.modalRuta();
    const seleccionadas = this.rutasSeleccionadas();
    if (!veh || !seleccionadas.length) {
      this.errorRuta = 'Selecciona al menos una ruta para quitar.';
      return;
    }

    this.vehiculoRutasPendientes = (veh.rutas ?? []).filter((r) =>
      seleccionadas.includes(Number(r.id_ruta)),
    );
    this.errorRuta = '';
    this.confirmarQuitarRutas.set(true);
  }

  cancelarQuitarRutas(): void {
    if (!this.quitandoRutas()) this.confirmarQuitarRutas.set(false);
  }

  confirmarQuitarRutasSeleccionadas(): void {
    const idUsuario = this.obtenerIdUsuario();
    const rutas = this.vehiculoRutasPendientes;
    if (!idUsuario || !rutas.length) return;

    this.quitandoRutas.set(true);
    this.errorRuta = '';

    let restantes = rutas.length;
    let fallo: any = null;

    rutas.forEach((r) => {
      this.api.asignarVehiculo(idUsuario, Number(r.id_ruta), null).subscribe({
        next: () => {
          restantes--;
          if (restantes === 0) this.finalizarQuitarRutas(fallo);
        },
        error: (e) => {
          fallo = fallo ?? e;
          restantes--;
          if (restantes === 0) this.finalizarQuitarRutas(fallo);
        },
      });
    });
  }

  private finalizarQuitarRutas(fallo: any): void {
    this.quitandoRutas.set(false);
    this.confirmarQuitarRutas.set(false);
    this.rutasSeleccionadas.set([]);
    this.vehiculoRutasPendientes = [];

    if (fallo) {
      this.errorRuta = this.extraerMensajeError(
        fallo,
        'No se pudieron quitar todas las rutas seleccionadas.',
      );
      return;
    }

    this.modalRuta.set(null);
    this.mensajeExito = 'Las rutas seleccionadas fueron quitadas del vehículo.';
    this.cargar();
  }

  guardarRuta(): void {
    const idUsuario = this.obtenerIdUsuario();
    const veh = this.modalRuta();

    if (!idUsuario || !veh || !this.ruta) {
      this.errorRuta = 'Selecciona una ruta.';
      return;
    }

    this.asignandoRuta.set(true);
    this.errorRuta = '';

    this.api.asignarVehiculo(idUsuario, this.ruta, veh.id_vehiculo).subscribe({
      next: () => {
        this.asignandoRuta.set(false);
        this.modalRuta.set(null);
        this.mensajeExito = 'Ruta asignada correctamente al vehículo.';
        this.cargar();
      },
      error: (e) => {
        this.asignandoRuta.set(false);
        this.errorRuta = this.extraerMensajeError(
          e,
          'No se pudo asignar la ruta.',
        );
      },
    });
  }

  rutasDisponibles(veh?: VehiculoProveedor | null) {
    const asignadas = new Set(
        (veh?.rutas ?? []).map(
            r => Number(r.id_ruta)
        )
    );

    return this.rutas().filter(r => {

        const yaAsignadaAEsteVehiculo =
            asignadas.has(Number(r.id_ruta));

        return (
            !yaAsignadaAEsteVehiculo &&
            r.id_vehiculo == null
        );
    });
}
}
