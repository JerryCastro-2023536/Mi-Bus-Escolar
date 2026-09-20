import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login';
import { ProveedorOperacionesService } from '../../services/proveedorOperaciones.service';
import { ViajeProveedor } from '../../models/proveedor-operaciones.model';
@Component({
    selector: 'app-viajes-proveedor-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './viajes-proveedor-view.html',
    styleUrl: './viajes-proveedor-view.css',
})
export class ViajesProveedorView implements OnInit {
    private login = inject(LoginService);
    private api = inject(ProveedorOperacionesService);
    viajes = signal<ViajeProveedor[]>([]);
    filtro = signal<'TODOS' | 'ACTIVO' | 'FINALIZADO'>('TODOS');
    cargando = signal(false);
    error = '';
    ngOnInit() {
        const u = this.login.getUser();
        const id = u?.id_usuario ?? u?.id;
        if (!id) return;
        this.cargando.set(true);
        this.api.viajes(id).subscribe({
            next: (x) => {
                this.viajes.set(x);
                this.cargando.set(false);
            },
            error: (e) => {
                this.error = e?.error?.message || 'No se pudieron cargar los viajes.';
                this.cargando.set(false);
            },
        });
    }
    filtrados() {
        const f = this.filtro();
        return f === 'TODOS' ? this.viajes() : this.viajes().filter((v) => v.estado === f);
    }
    labelEstado(e: string) {
        return e === 'ACTIVO' ? 'En curso' : e === 'FINALIZADO' ? 'Finalizado' : 'Programado';
    }
}
