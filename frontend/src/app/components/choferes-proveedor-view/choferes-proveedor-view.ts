import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { LoginService } from '../../services/login';
import { ProveedorOperacionesService } from '../../services/proveedorOperaciones.service';
import {
    ProveedorChofer,
    ProveedorRutaResumen,
    ProveedorUsuario,
} from '../../models/proveedor-operaciones.model';

@Component({
    selector: 'app-choferes-proveedor-view',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './choferes-proveedor-view.html',
    styleUrl: './choferes-proveedor-view.css',
})
export class ChoferesProveedorView implements OnInit {
    private login = inject(LoginService);
    private api = inject(ProveedorOperacionesService);
    choferes = signal<ProveedorChofer[]>([]);
    rutas = signal<ProveedorRutaResumen[]>([]);
    cargando = signal(false);
    modalUsuario = signal(false);
    busqueda = '';
    usuarios = signal<ProveedorUsuario[]>([]);
    buscando = signal(false);
    creando = signal(false);
    modalEditar = signal(false);
    editando = signal<ProveedorChofer | null>(null);
    telefono = '';
    estado = 'ACTIVO';
    guardando = signal(false);
    modalRutas = signal(false);
    choferRutas = signal<ProveedorChofer | null>(null);
    seleccionadas = signal<number[]>([]);
    quitando = signal(false);
    rutaAsignar: number | null = null;
    asignando = signal(false);
    eliminar = signal<ProveedorChofer | null>(null);
    eliminando = signal(false);
    mensajeExito = '';
    mensajeError = '';
    errorModal = '';

    ngOnInit() {
        this.cargar();
    }
    private idUsuario() {
        const u = this.login.getUser();
        return u?.id_usuario ?? u?.id ?? null;
    }
    cargar() {
        const id = this.idUsuario();
        if (!id) return;

        this.cargando.set(true);
        this.mensajeError = '';

        forkJoin({
            choferes: this.api.choferes(id),
            rutas: this.api.rutas(id),
        }).subscribe({
            next: ({ choferes, rutas }) => {
                this.choferes.set(choferes);
                this.rutas.set(rutas);
                this.cargando.set(false);
            },
            error: (e) => {
                this.cargando.set(false);
                this.mensajeError = e?.error?.message || 'No se pudieron cargar los choferes.';
            },
        });
    }
    abrirNuevo() {
        this.busqueda = '';
        this.usuarios.set([]);
        this.errorModal = '';
        this.modalUsuario.set(true);
    }
    cerrarNuevo() {
        if (!this.creando()) this.modalUsuario.set(false);
    }
    buscarUsuarios() {
        const id = this.idUsuario();
        if (!id || this.busqueda.trim().length < 2) return;
        this.buscando.set(true);
        this.errorModal = '';
        this.api.usuariosParaChofer(id, this.busqueda.trim()).subscribe({
            next: (x) => {
                this.usuarios.set(x);
                this.buscando.set(false);
            },
            error: (e) => {
                this.buscando.set(false);
                this.errorModal = e?.error?.message || 'No se pudieron buscar usuarios.';
            },
        });
    }
    seleccionarUsuario(u: ProveedorUsuario) {
        const id = this.idUsuario();
        if (!id) return;
        this.creando.set(true);
        this.errorModal = '';
        this.api.crearChofer(id, u.id_usuario).subscribe({
            next: () => {
                this.creando.set(false);
                this.modalUsuario.set(false);
                this.mensajeExito = `${u.nombre} ${u.apellido} ahora es chofer.`;
                this.cargar();
            },
            error: (e) => {
                this.creando.set(false);
                this.errorModal = e?.error?.message || 'No se pudo crear el chofer.';
            },
        });
    }
    abrirEditar(c: ProveedorChofer) {
        this.editando.set(c);
        this.telefono = c.telefono_contacto;
        this.estado = c.estado;
        this.errorModal = '';
        this.modalEditar.set(true);
    }
    guardarEdicion() {
        const id = this.idUsuario(),
            c = this.editando();
        if (!id || !c) return;
        this.guardando.set(true);
        this.api
            .actualizarChofer(id, c.id_chofer, {
                telefono_contacto: this.telefono.trim(),
                estado: this.estado,
            })
            .subscribe({
                next: () => {
                    this.guardando.set(false);
                    this.modalEditar.set(false);
                    this.mensajeExito = 'Chofer actualizado correctamente.';
                    this.cargar();
                },
                error: (e) => {
                    this.guardando.set(false);
                    this.errorModal = e?.error?.message || 'No se pudo actualizar el chofer.';
                },
            });
    }
    abrirRutas(c: ProveedorChofer) {
        this.choferRutas.set(c);
        this.seleccionadas.set([]);
        this.rutaAsignar = null;
        this.errorModal = '';
        this.modalRutas.set(true);
    }
    cerrarRutas() {
        if (this.quitando() || this.asignando()) return;

        this.modalRutas.set(false);
        this.choferRutas.set(null);
        this.seleccionadas.set([]);
        this.rutaAsignar = null;
        this.errorModal = '';
    }
    rutasDisponibles(chofer: ProveedorChofer | null): ProveedorRutaResumen[] {
        if (!chofer) return [];

        const asignadas = new Set(
            (chofer.rutas ?? []).map((r) => Number(r.id_ruta)),
        );

        return this.rutas().filter((r) =>
            !asignadas.has(Number(r.id_ruta)) && r.id_chofer == null,
        );
    }
    asignarRuta() {
        const id = this.idUsuario();
        const chofer = this.choferRutas();

        if (!id || !chofer) return;

        if (!this.rutaAsignar) {
            this.errorModal = 'Selecciona una ruta para asignar.';
            return;
        }

        this.asignando.set(true);
        this.errorModal = '';

        this.api.asignarChofer(id, this.rutaAsignar, chofer.id_chofer).subscribe({
            next: () => {
                this.asignando.set(false);
                this.modalRutas.set(false);
                this.choferRutas.set(null);
                this.seleccionadas.set([]);
                this.rutaAsignar = null;
                this.mensajeExito = 'Ruta asignada correctamente al chofer.';
                this.cargar();
            },
            error: (e) => {
                this.asignando.set(false);
                this.errorModal = e?.error?.message || 'No se pudo asignar la ruta al chofer.';
            },
        });
    }
    toggleRuta(r: ProveedorRutaResumen) {
        const a = this.seleccionadas();
        this.seleccionadas.set(
            a.includes(r.id_ruta) ? a.filter((x) => x !== r.id_ruta) : [...a, r.id_ruta],
        );
    }
    pedirQuitar() {
        const c = this.choferRutas();
        if (!c || !this.seleccionadas().length) return;
        const id = this.idUsuario();
        if (!id) return;
        this.quitando.set(true);
        this.api.desasignarRutasChofer(id, c.id_chofer, this.seleccionadas()).subscribe({
            next: () => {
                this.quitando.set(false);
                this.modalRutas.set(false);
                this.mensajeExito = 'Rutas desasignadas correctamente.';
                this.cargar();
            },
            error: (e) => {
                this.quitando.set(false);
                this.errorModal = e?.error?.message || 'No se pudieron desasignar las rutas.';
            },
        });
    }
    pedirEliminar(c: ProveedorChofer) {
        this.eliminar.set(c);
    }
    cancelarEliminar() {
        if (!this.eliminando()) this.eliminar.set(null);
    }
    confirmarEliminar() {
        const id = this.idUsuario(),
            c = this.eliminar();
        if (!id || !c) return;
        this.eliminando.set(true);
        this.api.eliminarChofer(id, c.id_chofer).subscribe({
            next: () => {
                this.eliminando.set(false);
                this.eliminar.set(null);
                this.mensajeExito = 'Chofer eliminado correctamente.';
                this.cargar();
            },
            error: (e) => {
                this.eliminando.set(false);
                this.eliminar.set(null);
                this.mensajeError = e?.error?.message || 'No se pudo eliminar el chofer.';
            },
        });
    }
}
