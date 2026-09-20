import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login';
import { ProveedorOperacionesService } from '../../services/proveedorOperaciones.service';
import {
    AsignacionRutaProveedor,
    EstudianteDisponible,
    ProveedorRutaResumen,
    ProveedorServicio,
} from '../../models/proveedor-operaciones.model';

@Component({
    selector: 'app-asignacion-ruta-proveedor-view',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './asignacion-ruta-proveedor-view.html',
    styleUrl: './asignacion-ruta-proveedor-view.css',
})
export class AsignacionRutaProveedorView implements OnInit {
    private login = inject(LoginService);
    private api = inject(ProveedorOperacionesService);
    servicios = signal<ProveedorServicio[]>([]);
    servicioSeleccionado = signal<number | null>(null);
    rutas = signal<ProveedorRutaResumen[]>([]);
    ruta = signal<ProveedorRutaResumen | null>(null);
    asignaciones = signal<AsignacionRutaProveedor[]>([]);
    resultados = signal<EstudianteDisponible[]>([]);
    cargando = signal(false);
    buscando = signal(false);
    guardando = signal(false);
    retirando = signal(false);
    modal = signal(false);
    confirmar = signal<EstudianteDisponible | null>(null);
    aRetirar = signal<AsignacionRutaProveedor | null>(null);
    busqueda = '';
    exito = '';
    error = '';
    ngOnInit() {
        this.cargarRutas();
    }
    idUsuario() {
        const u = this.login.getUser();
        return u?.id_usuario ?? u?.id ?? null;
    }
    cargarRutas() {
        const id = this.idUsuario();
        if (!id) return;
        this.api
            .servicios(id)
            .subscribe({
                next: (s) => this.servicios.set(s),
                error: (e) => (this.error = e?.error?.message || 'No se pudieron cargar los servicios.'),
            });
        this.api
            .rutasParaAsignacion(id)
            .subscribe({
                next: (r) => this.rutas.set(r),
                error: (e) => (this.error = e?.error?.message || 'No se pudieron cargar las rutas.'),
            });
    }
    seleccionarServicio(id: number) {
        this.servicioSeleccionado.set(id);
        this.ruta.set(null);
        this.asignaciones.set([]);
    }
    rutasFiltradas() {
        const s = this.servicioSeleccionado();
        return s ? this.rutas().filter((r) => r.id_servicio === s) : [];
    }
    seleccionar(r: ProveedorRutaResumen) {
        this.ruta.set(r);
        this.error = '';
        this.cargando.set(true);
        const id = this.idUsuario();
        if (!id) return;
        this.api.asignacionesRuta(id, r.id_ruta).subscribe({
            next: (a) => {
                this.asignaciones.set(a);
                this.cargando.set(false);
            },
            error: (e) => {
                this.cargando.set(false);
                this.error = e?.error?.message || 'No se pudieron cargar los estudiantes.';
            },
        });
    }
    abrirBuscar() {
        this.busqueda = '';
        this.resultados.set([]);
        this.error = '';
        this.modal.set(true);
    }
    cerrarBuscar() {
        if (!this.guardando()) this.modal.set(false);
    }
    buscar() {
        const id = this.idUsuario(),
            r = this.ruta();
        if (!id || !r || this.busqueda.trim().length < 2) return;
        this.buscando.set(true);
        this.error = '';
        this.api.buscarEstudiantes(id, r.id_ruta, this.busqueda.trim()).subscribe({
            next: (x) => {
                this.resultados.set(x);
                this.buscando.set(false);
            },
            error: (e) => {
                this.buscando.set(false);
                this.error = e?.error?.message || 'No se pudo realizar la búsqueda.';
            },
        });
    }
    seleccionarEstudiante(e: EstudianteDisponible) {
        this.confirmar.set(e);
    }
    cancelarConfirmacion() {
        if (!this.guardando()) this.confirmar.set(null);
    }
    confirmarAsignacion() {
        const id = this.idUsuario(),
            r = this.ruta(),
            e = this.confirmar();
        if (!id || !r || !e) return;
        this.guardando.set(true);
        this.api.asignarEstudiante(id, r.id_ruta, e.id_estudiante).subscribe({
            next: () => {
                this.guardando.set(false);
                this.confirmar.set(null);
                this.modal.set(false);
                this.exito = `${e.nombre} ${e.apellido} fue asignado a ${r.nombre}.`;
                this.seleccionar(r);
            },
            error: (x) => {
                this.guardando.set(false);
                this.error = x?.error?.message || 'No se pudo asignar el estudiante.';
            },
        });
    }
    pedirRetirar(a: AsignacionRutaProveedor) {
        this.aRetirar.set(a);
    }
    cancelarRetirar() {
        if (!this.retirando()) this.aRetirar.set(null);
    }
    confirmarRetirar() {
        const id = this.idUsuario(),
            r = this.ruta(),
            a = this.aRetirar();
        if (!id || !r || !a) return;
        this.retirando.set(true);
        this.api.retirarEstudiante(id, r.id_ruta, a.id_asignacion).subscribe({
            next: () => {
                this.retirando.set(false);
                this.aRetirar.set(null);
                this.exito = 'Estudiante retirado de la ruta.';
                this.seleccionar(r);
            },
            error: (e) => {
                this.retirando.set(false);
                this.aRetirar.set(null);
                this.error = e?.error?.message || 'No se pudo retirar el estudiante.';
            },
        });
    }
}
