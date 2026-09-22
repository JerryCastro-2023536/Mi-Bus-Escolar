import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login';
import { ProveedorOperacionesService } from '../../services/proveedorOperaciones.service';
import { ViajeProveedor } from '../../models/proveedor-operaciones.model';
import { MapaComponent } from '../mapa/mapa.component';
import { PuntoRuta } from '../../models/mapas.type';

@Component({
    selector: 'app-viajes-proveedor-view',
    standalone: true,
    imports: [CommonModule, MapaComponent],
    templateUrl: './viajes-proveedor-view.html',
    styleUrl: './viajes-proveedor-view.css',
})
export class ViajesProveedorView implements OnInit, OnDestroy {
    private login = inject(LoginService);
    private api = inject(ProveedorOperacionesService);

    viajes = signal<ViajeProveedor[]>([]);
    filtro = signal<'TODOS' | 'ACTIVO' | 'FINALIZADO'>('TODOS');
    cargando = signal(false);
    error = '';

    modalRastreoAbierto = signal(false);
    viajeSeleccionado = signal<ViajeProveedor | null>(null);
    trazadoRuta = signal<PuntoRuta[]>([]);
    posicionChofer = signal<PuntoRuta | undefined>(undefined);
    cargandoMapa = signal(false);
    private intervaloRastreo: any = null;

    ngOnInit() {
        this.cargarViajes();
    }

    cargarViajes() {
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

    abrirModalRastreo(v: ViajeProveedor): void {
        this.viajeSeleccionado.set(v);
        this.modalRastreoAbierto.set(true);
        this.cargandoMapa.set(true);

        if (v.id_ruta) {
            this.api.obtenerTrazadoRuta(v.id_ruta).subscribe({
                next: (puntos) => {
                    this.trazadoRuta.set(puntos || []);
                    this.cargandoMapa.set(false);
                },
                error: () => {
                    this.trazadoRuta.set([]);
                    this.cargandoMapa.set(false);
                }
            });
        } else {
            this.trazadoRuta.set([]);
            this.cargandoMapa.set(false);
        }

        this.actualizarGPSChofer(v.id_viaje);

        this.detenerSondeo();
        this.intervaloRastreo = setInterval(() => {
            this.actualizarGPSChofer(v.id_viaje);
        }, 4000);
    }

    private actualizarGPSChofer(idViaje: number): void {
        this.api.obtenerUbicacionActualViaje(idViaje).subscribe({
            next: (data) => {
                if (data && data.latitud && data.longitud) {
                    this.posicionChofer.set({
                        lat: Number(data.latitud),
                        lng: Number(data.longitud)
                    });
                }
            },
            error: (err) => {
                console.warn('Error consultando GPS del chofer:', err);
            }
        });
    }

    cerrarModalRastreo(): void {
        this.detenerSondeo();
        this.modalRastreoAbierto.set(false);
        this.viajeSeleccionado.set(null);
        this.posicionChofer.set(undefined);
        this.trazadoRuta.set([]);
    }

    private detenerSondeo(): void {
        if (this.intervaloRastreo) {
            clearInterval(this.intervaloRastreo);
            this.intervaloRastreo = null;
        }
    }

    ngOnDestroy(): void {
        this.detenerSondeo();
    }
}
