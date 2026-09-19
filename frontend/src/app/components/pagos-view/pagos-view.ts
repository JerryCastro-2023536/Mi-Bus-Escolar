import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login';
import { PagoService } from '../../services/pago.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { EstudianteResumen, MesPago } from '../../models/pago.model';

const NOMBRES_MES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

@Component({
    selector: 'app-pagos-view',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './pagos-view.html',
    styleUrl: './pagos-view.css'
})
export class PagosView implements OnInit {
    private loginService = inject(LoginService);
    private pagoService = inject(PagoService);
    private cloudinaryService = inject(CloudinaryService);

    //estudiantes
    estudiantes = signal<EstudianteResumen[]>([]);
    cargandoEstudiantes = signal(false);

    //meses
    estudianteSeleccionado = signal<EstudianteResumen | null>(null);
    meses = signal<MesPago[]>([]);
    cargandoMeses = signal(false);

    //detalle / formulario
    mesSeleccionado = signal<MesPago | null>(null);

    // Formulario de pago
    metodoPago = '';
    referenciaPago = '';
    fotoComprobante: string | null = null;
    subiendoFoto = signal(false);
    draggingImage = false;
    guardando = signal(false);

    mensajeExito = '';
    mensajeError = '';

    ngOnInit(): void {
        this.cargarEstudiantes();
    }

    private cargarEstudiantes(): void {
        const sesion = this.loginService.getUser();
        const idUsuario = sesion?.id_usuario ?? sesion?.id;
        if (!idUsuario) return;

        this.cargandoEstudiantes.set(true);
        this.pagoService.listarEstudiantesPorTutor(idUsuario).subscribe({
            next: (data) => {
                this.estudiantes.set(data);
                this.cargandoEstudiantes.set(false);
            },
            error: () => {
                this.cargandoEstudiantes.set(false);
                this.mensajeError = 'No se pudieron cargar los estudiantes.';
            }
        });
    }

    seleccionarEstudiante(est: EstudianteResumen): void {
        this.estudianteSeleccionado.set(est);
        this.mesSeleccionado.set(null);
        this.cargandoMeses.set(true);

        this.pagoService.listarMesesPendientes(est.id_estudiante).subscribe({
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
        this.metodoPago = '';
        this.referenciaPago = '';
        this.fotoComprobante = null;
        this.mensajeError = '';
    }

    volverAMeses(): void {
        this.mesSeleccionado.set(null);
    }

    nombreMes(numero: number): string {
        return NOMBRES_MES[numero - 1] ?? '';
    }

    //Subida de comprobante
    onFotoSeleccionada(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        this.subirComprobante(file);
        input.value = '';
    }

    onDragOverImage(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.draggingImage = true;
    }

    onDragLeaveImage(event: DragEvent): void {
        event.preventDefault();
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        if (
            event.clientX <= rect.left || event.clientX >= rect.right ||
            event.clientY <= rect.top || event.clientY >= rect.bottom
        ) {
            this.draggingImage = false;
        }
    }

    onFileDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.draggingImage = false;
        const file = event.dataTransfer?.files?.[0];
        if (!file) return;
        this.subirComprobante(file);
    }

    private subirComprobante(file: File): void {
        this.subiendoFoto.set(true);
        this.cloudinaryService.upload(file, 'comprobantes').subscribe({
            next: (url) => {
                this.fotoComprobante = url;
                this.subiendoFoto.set(false);
            },
            error: () => {
                this.subiendoFoto.set(false);
                this.mensajeError = 'No se pudo subir el comprobante. Intenta de nuevo.';
            }
        });
    }

    removeComprobante(): void {
        this.fotoComprobante = null;
    }

    //Registrar pago
    confirmarPago(): void {
        const est = this.estudianteSeleccionado();
        const mes = this.mesSeleccionado();
        if (!est || !mes) return;

        if (!this.metodoPago) {
            this.mensajeError = 'Selecciona un método de pago.';
            return;
        }

        this.guardando.set(true);
        this.mensajeError = '';

        this.pagoService.registrarPago({
            id_estudiante: est.id_estudiante,
            id_servicio: mes.id_servicio,
            periodo_mes: mes.periodo_mes,
            periodo_anio: mes.periodo_anio,
            metodo_pago: this.metodoPago,
            referencia_pago: this.referenciaPago || undefined,
            foto_comprobante: this.fotoComprobante ?? undefined
        }).subscribe({
            next: (pagoActualizado) => {
                this.guardando.set(false);
                this.mensajeExito = 'Pago registrado correctamente. Se notificó al proveedor.';

                // Refresca el mes en memoria para reflejar el estado pagado sin recargar todo
                this.meses.update(lista =>
                    lista.map(m =>
                        m.periodo_mes === mes.periodo_mes && m.periodo_anio === mes.periodo_anio
                            ? { ...m, ...pagoActualizado, estado: 'PAGADO' }
                            : m
                    )
                );
                this.mesSeleccionado.set({ ...mes, ...pagoActualizado, estado: 'PAGADO' });
            },
            error: (err) => {
                this.guardando.set(false);
                this.mensajeError = err?.error?.errors?.[0]?.mensaje || err?.error?.message || 'No se pudo registrar el pago.';
            }
        });
    }
}