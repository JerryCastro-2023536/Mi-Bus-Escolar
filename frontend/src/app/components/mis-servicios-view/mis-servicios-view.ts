import { ServicioBusService } from '../../services/servicioBus.service';
import { FormComponent } from '../crud-view/form/form';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login';
import {NuevoServicioBus, ServicioBus } from '../../models/servicioBus.interface';
import { FormField } from '../../models/crudDTO.interface';

@Component({
  selector: 'app-mis-servicios-view',
  standalone: true,
  imports: [CommonModule, FormComponent],
  templateUrl: './mis-servicios-view.html',
  styleUrl: './mis-servicios-view.css'
})
export class MisServiciosView implements OnInit {
  private loginService = inject(LoginService);
  private servicioBusService = inject(ServicioBusService);

  servicios = signal<ServicioBus[]>([]);
  cargandoServicios = signal(false);

  servicioSeleccionado = signal<ServicioBus | null>(null);

  mostrarFormulario = signal(false);
  servicioEnEdicion = signal<ServicioBus | null>(null);
  guardando = signal(false);
  erroresForm = signal<Record<string, string>>({});

  readonly camposServicio: FormField[] = [
    { key: 'nombre', label: 'Nombre del servicio', type: 'text', required: true },
    { key: 'descripcion', label: 'Descripción', type: 'text' },
    { key: 'precio_mensual', label: 'Precio mensual (Q)', type: 'number', required: true }
  ];


  cambiandoEstado = signal(false);
  confirmandoEliminar = signal(false);
  eliminando = signal(false);

  mensajeExito = '';
  mensajeError = '';

  ngOnInit(): void {
    this.cargarServicios();
  }

  private obtenerIdUsuario(): number | null {
    const sesion = this.loginService.getUser();
    return sesion?.id_usuario ?? sesion?.id ?? null;
  }

  private limpiarMensajes(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  private mensajeDeError(err: any, porDefecto: string): string {
    return err?.error?.errors?.[0]?.mensaje || err?.error?.message || porDefecto;
  }

  //Lista de servicios
  private cargarServicios(): void {
    const idUsuario = this.obtenerIdUsuario();
    if (!idUsuario) return;

    this.cargandoServicios.set(true);
    this.servicioBusService.listar(idUsuario).subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.cargandoServicios.set(false);
      },
      error: (err) => {
        this.cargandoServicios.set(false);
        this.mensajeError = this.mensajeDeError(err, 'No se pudieron cargar tus servicios.');
      }
    });
  }

  seleccionarServicio(servicio: ServicioBus): void {
    this.servicioSeleccionado.set(servicio);
    this.confirmandoEliminar.set(false);
    this.limpiarMensajes();
  }

  volverAServicios(): void {
    this.servicioSeleccionado.set(null);
    this.confirmandoEliminar.set(false);
  }

  // Reemplaza el servicio en la lista y en el detalle con lo que devolvió el backend.
  private reemplazarServicio(actualizado: ServicioBus): void {
    this.servicios.update(lista =>
      lista
        .map(s => s.id_servicio === actualizado.id_servicio ? actualizado : s)
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
    );

    if (this.servicioSeleccionado()?.id_servicio === actualizado.id_servicio) {
      this.servicioSeleccionado.set(actualizado);
    }
  }

  //Alta / edición
  abrirFormulario(): void {
    this.servicioEnEdicion.set(null);
    this.erroresForm.set({});
    this.limpiarMensajes();
    this.mostrarFormulario.set(true);
  }

  abrirEdicion(servicio: ServicioBus): void {
    this.servicioEnEdicion.set(servicio);
    this.erroresForm.set({});
    this.limpiarMensajes();
    this.confirmandoEliminar.set(false);
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.servicioEnEdicion.set(null);
    this.erroresForm.set({});
  }

  guardarServicio(datos: Record<string, any>): void {
    if (this.guardando()) return;

    const idUsuario = this.obtenerIdUsuario();
    if (!idUsuario) {
      this.cerrarFormulario();
      this.mensajeError = 'No se pudo identificar al proveedor. Vuelve a iniciar sesión.';
      return;
    }

    const servicio: NuevoServicioBus = {
      nombre: String(datos['nombre'] ?? '').trim(),
      descripcion: String(datos['descripcion'] ?? '').trim() || null,
      precio_mensual: Number(datos['precio_mensual'])
    };

    const errores = this.validar(servicio);
    if (Object.keys(errores).length > 0) {
      this.erroresForm.set(errores);
      return;
    }

    const enEdicion = this.servicioEnEdicion();

    this.guardando.set(true);
    this.erroresForm.set({});

    const peticion = enEdicion
      ? this.servicioBusService.actualizar(idUsuario, enEdicion.id_servicio, { ...servicio, estado: enEdicion.estado })
      : this.servicioBusService.registrar(idUsuario, servicio);

    peticion.subscribe({
      next: (guardado) => {
        this.guardando.set(false);
        this.cerrarFormulario();

        if (enEdicion) {
          this.reemplazarServicio(guardado);
          this.mensajeExito = `Servicio "${guardado.nombre}" actualizado correctamente.`;
        } else {
          this.servicios.update(lista =>
            [...lista, guardado].sort((a, b) => a.nombre.localeCompare(b.nombre))
          );
          this.mensajeExito = `Servicio "${guardado.nombre}" registrado correctamente.`;
        }
      },
      error: (err) => {
        this.guardando.set(false);
        this.manejarErrorGuardado(err, enEdicion ? 'No se pudo actualizar el servicio.' : 'No se pudo registrar el servicio.');
      }
    });
  }

  private validar(servicio: NuevoServicioBus): Record<string, string> {
    const errores: Record<string, string> = {};

    if (!servicio.nombre) {
      errores['nombre'] = 'El nombre del servicio es obligatorio.';
    }
    if (!Number.isFinite(servicio.precio_mensual) || servicio.precio_mensual <= 0) {
      errores['precio_mensual'] = 'El precio mensual debe ser mayor a 0.';
    }

    return errores;
  }

  private manejarErrorGuardado(err: any, porDefecto: string): void {
    // Errores por campo (ValidationError): se muestran dentro del formulario
    const lista: { campo?: string; mensaje?: string }[] = Array.isArray(err?.error?.errors) ? err.error.errors : [];
    const porCampo: Record<string, string> = {};

    for (const e of lista) {
      if (e.campo && e.mensaje && this.camposServicio.some(c => c.key === e.campo)) {
        porCampo[e.campo] = e.mensaje;
      }
    }

    if (Object.keys(porCampo).length > 0) {
      this.erroresForm.set(porCampo);
      return;
    }

    // Error general: el formulario está sobre la pantalla, así que se cierra para mostrar la alerta
    this.cerrarFormulario();
    this.mensajeError = this.mensajeDeError(err, porDefecto);
  }

  //Activar / desactivar
  alternarEstado(servicio: ServicioBus): void {
    if (this.cambiandoEstado()) return;

    const idUsuario = this.obtenerIdUsuario();
    if (!idUsuario) return;

    const nuevoEstado = servicio.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

    this.limpiarMensajes();
    this.cambiandoEstado.set(true);

    this.servicioBusService.actualizar(idUsuario, servicio.id_servicio, {
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio_mensual: Number(servicio.precio_mensual),
      estado: nuevoEstado
    }).subscribe({
      next: (actualizado) => {
        this.cambiandoEstado.set(false);
        this.reemplazarServicio(actualizado);
        this.mensajeExito = `Servicio "${actualizado.nombre}" ${nuevoEstado === 'ACTIVO' ? 'activado' : 'desactivado'} correctamente.`;
      },
      error: (err) => {
        this.cambiandoEstado.set(false);
        this.mensajeError = this.mensajeDeError(err, 'No se pudo cambiar el estado del servicio.');
      }
    });
  }

  //Eliminar
  pedirConfirmacionEliminar(): void {
    this.confirmandoEliminar.set(true);
  }

  cancelarEliminar(): void {
    this.confirmandoEliminar.set(false);
  }

  eliminarServicio(servicio: ServicioBus): void {
    if (this.eliminando()) return;

    const idUsuario = this.obtenerIdUsuario();
    if (!idUsuario) return;

    this.limpiarMensajes();
    this.eliminando.set(true);

    this.servicioBusService.eliminar(idUsuario, servicio.id_servicio).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.confirmandoEliminar.set(false);
        this.servicios.update(lista => lista.filter(s => s.id_servicio !== servicio.id_servicio));
        this.servicioSeleccionado.set(null);
        this.mensajeExito = `Servicio "${servicio.nombre}" eliminado correctamente.`;
      },
      error: (err) => {
        this.eliminando.set(false);
        this.confirmandoEliminar.set(false);
        this.mensajeError = this.mensajeDeError(err, 'No se pudo eliminar el servicio.');
      }
    });
  }
}