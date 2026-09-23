import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login';
import { ProveedorOperacionesService } from '../../services/proveedorOperaciones.service';
import {
  ProveedorServicio,
  ValoracionProveedor,
} from '../../models/proveedor-operaciones.model';

@Component({
  selector: 'app-valoraciones-proveedor-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './valoraciones-proveedor-view.html',
  styleUrl: './valoraciones-proveedor.view.css',
})
export class ValoracionesProveedorView implements OnInit {
  private login = inject(LoginService);
  private api = inject(ProveedorOperacionesService);

  servicios = signal<ProveedorServicio[]>([]);
  valoraciones = signal<ValoracionProveedor[]>([]);
  cargandoServicios = signal(false);
  cargandoValoraciones = signal(false);

  idServicioSeleccionado: number | null = null;
  error = '';


  ngOnInit(): void {
    this.cargarServicios();
  }

  private idUsuario(): number | null {
    const u = this.login.getUser();
    const value = u?.id_usuario ?? u?.id;
    return value ? Number(value) : null;
  }

  cargarServicios(): void {
    const idUsuario = this.idUsuario();
    if (!idUsuario) return;

    this.cargandoServicios.set(true);
    this.error = '';

    this.api.servicios(idUsuario).subscribe({
      next: (servicios) => {
        this.servicios.set(servicios ?? []);
        this.cargandoServicios.set(false);

        const primero = servicios?.[0];
        if (primero) {
          this.idServicioSeleccionado = primero.id_servicio;
          this.cargarValoraciones();
        } else {
          this.valoraciones.set([]);
        }
      },
      error: (e) => {
        this.cargandoServicios.set(false);
        this.error = e?.error?.message || 'No se pudieron cargar tus servicios.';
      },
    });
  }

  cargarValoraciones(): void {
    const idUsuario = this.idUsuario();
    const idServicio = Number(this.idServicioSeleccionado);

    if (!idUsuario || !idServicio) {
      this.valoraciones.set([]);
      return;
    }

    this.cargandoValoraciones.set(true);
    this.error = '';

    this.api.valoraciones(idUsuario, idServicio).subscribe({
      next: (valoraciones) => {
        this.valoraciones.set(valoraciones ?? []);

        this.cargandoValoraciones.set(false);
      },
      error: (e) => {
        this.valoraciones.set([]);
        this.cargandoValoraciones.set(false);
        this.error =
          e?.error?.message ||
          'No se pudieron cargar las valoraciones.';
      },
    });
  }

  servicioSeleccionado(): ProveedorServicio | undefined {
    return this.servicios().find(
      (s) => s.id_servicio === Number(this.idServicioSeleccionado),
    );
  }

  promedio(): string {
    const lista = this.valoraciones();
    if (!lista.length) return '0.0';

    const total = lista.reduce(
      (suma, v) => suma + Number(v.calificacion || 0),
      0,
    );

    return (total / lista.length).toFixed(1);
  }

  estrellas(calificacion: number): boolean[] {
    const n = Math.max(0, Math.min(5, Math.round(Number(calificacion) || 0)));
    return Array.from({ length: 5 }, (_, i) => i < n);
  }
}
