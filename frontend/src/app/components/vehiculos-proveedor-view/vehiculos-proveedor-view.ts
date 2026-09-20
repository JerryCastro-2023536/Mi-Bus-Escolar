import { VehiculosProveedorService } from './../../services/vehiculosProveedor.service';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login';
import { CloudinaryService } from '../../services/cloudinary.service';
import { EstadoVehiculo, VehiculoProveedor } from '../../models/vehiculoProveedor.interface';

@Component({
  selector: 'app-vehiculos-proveedor-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculos-proveedor-view.html',
  styleUrl: './vehiculos-proveedor-view.css'
})
export class VehiculosProveedorView implements OnInit {
  private loginService = inject(LoginService);
  private vehiculosService = inject(VehiculosProveedorService);
  private cloudinaryService = inject(CloudinaryService);

  vehiculos = signal<VehiculoProveedor[]>([]);
  cargando = signal(false);

  mensajeError = '';
  mensajeExito = '';

  // ---- Modal de alta / edición ----
  modalAbierto = signal(false);
  modoEdicion = signal(false);
  vehiculoEditando = signal<VehiculoProveedor | null>(null);

  placaForm = '';
  estadoForm: EstadoVehiculo = 'ACTIVO';
  fotoUrlForm: string | null = null;
  subiendoFoto = signal(false);
  guardando = signal(false);
  errorModal = '';

  // ---- Modal de confirmación de borrado ----
  vehiculoAEliminar = signal<VehiculoProveedor | null>(null);
  eliminando = signal(false);

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  private obtenerIdUsuario(): number | null {
    const sesion = this.loginService.getUser();
    return sesion?.id_usuario ?? sesion?.id ?? null;
  }

  private cargarVehiculos(): void {
    const idUsuario = this.obtenerIdUsuario();
    if (!idUsuario) return;

    this.cargando.set(true);
    this.vehiculosService.listar(idUsuario).subscribe({
      next: (data) => {
        this.vehiculos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.mensajeError = 'No se pudieron cargar tus vehículos.';
      }
    });
  }

  // ---------------- Modal alta / edición ----------------

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
      error: () => {
        this.subiendoFoto.set(false);
        this.errorModal = 'No se pudo subir la foto. Intenta de nuevo.';
      }
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
      this.mensajeExito = editando ? 'Vehículo actualizado correctamente.' : 'Vehículo registrado correctamente.';
      this.cargarVehiculos();
    };

    const alFallar = (err: any) => {
      this.guardando.set(false);
      this.errorModal = err?.error?.message ?? 'Ocurrió un error al guardar el vehículo.';
    };

    if (editando && vehiculoActual) {
      this.vehiculosService.actualizar(idUsuario, vehiculoActual.id_vehiculo, {
        placa,
        foto_vehiculo: this.fotoUrlForm,
        estado: this.estadoForm
      }).subscribe({ next: alTerminar, error: alFallar });
    } else {
      this.vehiculosService.registrar(idUsuario, {
        placa,
        foto_vehiculo: this.fotoUrlForm
      }).subscribe({ next: alTerminar, error: alFallar });
    }
  }

  // ---------------- Modal de borrado ----------------

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
        this.cargarVehiculos();
      },
      error: (err) => {
        this.eliminando.set(false);
        this.vehiculoAEliminar.set(null);
        this.mensajeError = err?.error?.message ?? 'No se pudo eliminar el vehículo.';
      }
    });
  }
}
