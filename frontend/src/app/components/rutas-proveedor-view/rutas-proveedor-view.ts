import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { LoginService } from '../../services/login';
import { ProveedorOperacionesService } from '../../services/proveedorOperaciones.service';
import {
  ProveedorChofer,
  ProveedorRutaResumen,
  ProveedorServicio,
  ProveedorVehiculo,
} from '../../models/proveedor-operaciones.model';

@Component({
  selector: 'app-rutas-proveedor-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rutas-proveedor-view.html',
  styleUrl: './rutas-proveedor-view.css',
})
export class RutasProveedorView implements OnInit {
  private login = inject(LoginService);
  private api = inject(ProveedorOperacionesService);
  servicios = signal<ProveedorServicio[]>([]);
  rutas = signal<ProveedorRutaResumen[]>([]);
  vehiculos = signal<ProveedorVehiculo[]>([]);
  choferes = signal<ProveedorChofer[]>([]);
  cargando = signal(false);
  servicioSeleccionado = signal<number | null>(null);
  modalRuta = signal(false);
  editar = signal<ProveedorRutaResumen | null>(null);
  modalAsignacion = signal<'chofer' | 'vehiculo' | null>(null);
  rutaAsignando = signal<ProveedorRutaResumen | null>(null);
  modalEliminar = signal<ProveedorRutaResumen | null>(null);
  guardando = signal(false);
  mensajeExito = '';
  mensajeError = '';
  errorModal = '';
  nombre = '';
  inicio = '';
  fin = '';
  estado = 'ACTIVO';
  servicioForm: number | null = null;
  ngOnInit() {
    this.cargarTodo();
  }
  idUsuario() {
    const u = this.login.getUser();
    return u?.id_usuario ?? u?.id ?? null;
  }
  cargarTodo() {
    const id = this.idUsuario();
    if (!id) return;

    this.cargando.set(true);
    this.mensajeError = '';

    forkJoin({
      servicios: this.api.servicios(id),
      vehiculos: this.api.vehiculos(id),
      choferes: this.api.choferes(id),
      rutas: this.api.rutas(id),
    }).subscribe({
      next: ({ servicios, vehiculos, choferes, rutas }) => {
        this.servicios.set(servicios);
        this.vehiculos.set(vehiculos);
        this.choferes.set(choferes);
        this.rutas.set(rutas);
        if (this.servicioSeleccionado() === null && servicios.length) {
          this.servicioSeleccionado.set(servicios[0].id_servicio);
        }
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        this.mensajeError = e?.error?.message || 'No se pudo cargar la información de rutas.';
      },
    });
  }
  cargarRutas() {
    const id = this.idUsuario();
    if (!id) return;
    this.api.rutas(id).subscribe({
      next: (r) => {
        this.rutas.set(r);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        this.mensajeError = e?.error?.message || 'No se pudieron cargar las rutas.';
      },
    });
  }
  rutasFiltradas() {
    const s = this.servicioSeleccionado();
    return s ? this.rutas().filter((r) => r.id_servicio === s) : [];
  }
  seleccionarServicio(id: number | null) {
    this.servicioSeleccionado.set(id);
  }
  abrirNueva() {
    this.editar.set(null);
    this.nombre = '';
    this.inicio = '';
    this.fin = '';
    this.estado = 'ACTIVO';
    this.servicioForm = this.servicioSeleccionado() ?? this.servicios()[0]?.id_servicio ?? null;
    this.errorModal = '';
    this.modalRuta.set(true);
  }
  abrirEditar(r: ProveedorRutaResumen) {
    this.editar.set(r);
    this.nombre = r.nombre;
    this.inicio = r.hora_inicio_estimada?.slice(0, 5) || '';
    this.fin = r.hora_fin_estimada?.slice(0, 5) || '';
    this.estado = r.estado;
    this.servicioForm = r.id_servicio;
    this.errorModal = '';
    this.modalRuta.set(true);
  }
  guardarRuta() {
    const id = this.idUsuario();
    if (!id || !this.servicioForm || !this.nombre.trim()) {
      this.errorModal = 'El servicio y el nombre de la ruta son obligatorios.';
      return;
    }
    this.guardando.set(true);
    const data = {
      id_servicio: this.servicioForm,
      nombre: this.nombre.trim(),
      hora_inicio_estimada: this.inicio || null,
      hora_fin_estimada: this.fin || null,
      estado: this.estado,
    };
    const r = this.editar();
    const req = r ? this.api.actualizarRuta(id, r.id_ruta, data) : this.api.crearRuta(id, data);
    req.subscribe({
      next: () => {
        this.guardando.set(false);
        this.modalRuta.set(false);
        this.mensajeExito = r ? 'Ruta actualizada correctamente.' : 'Ruta creada correctamente.';
        this.cargarRutas();
      },
      error: (e) => {
        this.guardando.set(false);
        this.errorModal = e?.error?.message || 'No se pudo guardar la ruta.';
      },
    });
  }
  abrirAsignacion(r: ProveedorRutaResumen, t: 'chofer' | 'vehiculo') {
    this.rutaAsignando.set(r);
    this.modalAsignacion.set(t);
    this.errorModal = '';
  }
  asignar(id: number | null) {
    const u = this.idUsuario(),
      r = this.rutaAsignando(),
      t = this.modalAsignacion();
    if (!u || !r || !t) return;
    this.guardando.set(true);
    const req =
      t === 'chofer'
        ? this.api.asignarChofer(u, r.id_ruta, id)
        : this.api.asignarVehiculo(u, r.id_ruta, id);
    req.subscribe({
      next: () => {
        this.guardando.set(false);
        this.modalAsignacion.set(null);
        this.mensajeExito = `${t === 'chofer' ? 'Chofer' : 'Vehículo'} actualizado correctamente.`;
        this.cargarRutas();
      },
      error: (e) => {
        this.guardando.set(false);
        this.errorModal = e?.error?.message || 'No se pudo actualizar la asignación.';
      },
    });
  }
  pedirEliminar(r: ProveedorRutaResumen) {
    this.modalEliminar.set(r);
  }
  confirmarEliminar() {
    const u = this.idUsuario(),
      r = this.modalEliminar();
    if (!u || !r) return;
    this.guardando.set(true);
    this.api.eliminarRuta(u, r.id_ruta).subscribe({
      next: () => {
        this.guardando.set(false);
        this.modalEliminar.set(null);
        this.mensajeExito = 'Ruta eliminada correctamente.';
        this.cargarRutas();
      },
      error: (e) => {
        this.guardando.set(false);
        this.modalEliminar.set(null);
        this.mensajeError = e?.error?.message || 'No se pudo eliminar la ruta.';
      },
    });
  }
}
