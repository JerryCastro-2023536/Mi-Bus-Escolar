import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login';
import { ProveedorOperacionesService } from '../../services/proveedorOperaciones.service';
import { ValoracionProveedor } from '../../models/proveedor-operaciones.model';
@Component({
    selector: 'app-valoraciones-proveedor-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './valoraciones-proveedor-view.html',
    styleUrl: './valoraciones-proveedor.view.css',
})
export class ValoracionesProveedorView implements OnInit {
    private login = inject(LoginService);
    private api = inject(ProveedorOperacionesService);
    valoraciones = signal<ValoracionProveedor[]>([]);
    cargando = signal(false);
    error = '';
    ngOnInit() {
        const u = this.login.getUser();
        const id = u?.id_usuario ?? u?.id;
        if (!id) return;
        this.cargando.set(true);
        this.api.valoraciones(id).subscribe({
            next: (x) => {
                this.valoraciones.set(x);
                this.cargando.set(false);
            },
            error: (e) => {
                this.error = e?.error?.message || 'No se pudieron cargar las valoraciones.';
                this.cargando.set(false);
            },
        });
    }
    promedio() {
        const a = this.valoraciones();
        return a.length
            ? (a.reduce((s, v) => s + Number(v.calificacion), 0) / a.length).toFixed(1)
            : '0.0';
    }
    estrellas(n: number) {
        return Array.from({ length: 5 }, (_, i) => i < n);
    }
}
