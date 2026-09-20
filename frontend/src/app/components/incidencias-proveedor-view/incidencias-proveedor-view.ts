import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login';
import { ProveedorOperacionesService } from '../../services/proveedorOperaciones.service';
import { IncidenciaProveedor } from '../../models/proveedor-operaciones.model';
@Component({
    selector: 'app-incidencias-proveedor-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './incidencias-proveedor-view.html',
    styleUrl: './incidencias-proveedor-view.css',
})
export class IncidenciasProveedorView implements OnInit {
    private login = inject(LoginService);
    private api = inject(ProveedorOperacionesService);
    incidencias = signal<IncidenciaProveedor[]>([]);
    cargando = signal(false);
    error = '';
    ngOnInit() {
        const u = this.login.getUser();
        const id = u?.id_usuario ?? u?.id;
        if (!id) return;
        this.cargando.set(true);
        this.api.incidencias(id).subscribe({
            next: (x) => {
                this.incidencias.set(x);
                this.cargando.set(false);
            },
            error: (e) => {
                this.error = e?.error?.message || 'No se pudieron cargar las incidencias.';
                this.cargando.set(false);
            },
        });
    }
}
