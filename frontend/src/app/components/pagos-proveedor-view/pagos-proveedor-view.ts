import { ServicioProveedor } from './../../models/proveedores.model';
import { PagoProveedorService } from './../../services/pagosProveedor.service';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login';
import { EstudianteResumen, MesPago } from '../../models/pago.model';

const NOMBRES_MES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const normalizar = (texto: string): string =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

@Component({
  selector: 'app-pagos-proveedor-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagos-proveedor-view.html',
  styleUrl: './pagos-proveedor-view.css'
})
export class PagosProveedorView implements OnInit {
  private loginService = inject(LoginService);
  private pagoProveedorService = inject(PagoProveedorService);

  servicios = signal<ServicioProveedor[]>([]);
  cargandoServicios = signal(false);

  servicioSeleccionado = signal<ServicioProveedor | null>(null);
  estudiantes = signal<EstudianteResumen[]>([]);
  cargandoEstudiantes = signal(false);
  busqueda = signal('');

  estudiantesFiltrados = computed(() => {
    const termino = normalizar(this.busqueda().trim());
    if (!termino) return this.estudiantes();

    return this.estudiantes().filter(est =>
      normalizar(`${est.nombre} ${est.apellido}`).includes(termino)
    );
  });

  estudianteSeleccionado = signal<EstudianteResumen | null>(null);
  meses = signal<MesPago[]>([]);
  cargandoMeses = signal(false);

  mesesPagados = computed(() => this.meses().filter(m => m.estado === 'PAGADO').length);

  mesSeleccionado = signal<MesPago | null>(null);

  mensajeError = '';

  ngOnInit(): void {
    this.cargarServicios();
  }

  private obtenerIdUsuario(): number | null {
    const sesion = this.loginService.getUser();
    return sesion?.id_usuario ?? sesion?.id ?? null;
  }

  private cargarServicios(): void {
    const idUsuario = this.obtenerIdUsuario();
    if (!idUsuario) return;

    this.cargandoServicios.set(true);
    this.pagoProveedorService.listarServicios(idUsuario).subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.cargandoServicios.set(false);
      },
      error: () => {
        this.cargandoServicios.set(false);
        this.mensajeError = 'No se pudieron cargar tus servicios.';
      }
    });
  }

  seleccionarServicio(servicio: ServicioProveedor): void {
    const idUsuario = this.obtenerIdUsuario();
    if (!idUsuario) return;

    this.servicioSeleccionado.set(servicio);
    this.estudianteSeleccionado.set(null);
    this.mesSeleccionado.set(null);
    this.estudiantes.set([]);
    this.busqueda.set('');
    this.mensajeError = '';
    this.cargandoEstudiantes.set(true);

    this.pagoProveedorService.listarEstudiantesPorServicio(idUsuario, servicio.id_servicio).subscribe({
      next: (data) => {
        this.estudiantes.set(data);
        this.cargandoEstudiantes.set(false);
      },
      error: () => {
        this.cargandoEstudiantes.set(false);
        this.mensajeError = 'No se pudieron cargar los estudiantes del servicio.';
      }
    });
  }

  volverAServicios(): void {
    this.servicioSeleccionado.set(null);
    this.estudiantes.set([]);
    this.busqueda.set('');
  }

  onBuscar(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  seleccionarEstudiante(est: EstudianteResumen): void {
    const idUsuario = this.obtenerIdUsuario();
    const servicio = this.servicioSeleccionado();
    if (!idUsuario || !servicio) return;

    this.estudianteSeleccionado.set(est);
    this.mesSeleccionado.set(null);
    this.meses.set([]);
    this.mensajeError = '';
    this.cargandoMeses.set(true);

    this.pagoProveedorService.listarMesesEstudiante(idUsuario, servicio.id_servicio, est.id_estudiante).subscribe({
      next: (data) => {
        this.meses.set(data);
        this.cargandoMeses.set(false);
      },
      error: () => {
        this.cargandoMeses.set(false);
        this.mensajeError = 'No se pudieron cargar los meses de pago.';
      }
    });
  }

  volverAEstudiantes(): void {
    this.estudianteSeleccionado.set(null);
    this.meses.set([]);
  }

  seleccionarMes(mes: MesPago): void {
    this.mesSeleccionado.set(mes);
    this.mensajeError = '';
  }

  volverAMeses(): void {
    this.mesSeleccionado.set(null);
  }

  nombreMes(numero: number): string {
    return NOMBRES_MES[numero - 1] ?? '';
  }
}