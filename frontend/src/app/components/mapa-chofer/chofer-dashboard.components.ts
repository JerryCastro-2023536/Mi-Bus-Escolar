import { Component, OnInit, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PuntoRuta } from '../../models/mapas.type';
import { MapaComponent } from '../mapa/mapa.component';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { rutasService } from '../../services/rutas.service';
import { Incidencias } from '../../models/incidencias';

@Component({
  imports: [CommonModule, MapaComponent, ReactiveFormsModule],
  selector: 'app-chofer-dashboard',
  styleUrl: './chofer-dashboard.components.css',
  templateUrl: './chofer-dashboard.components.html',
})
export class ChoferDashboardComponents implements OnInit {
  
  private fb = inject(FormBuilder);
  private viajesService = inject(rutasService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  mostrarModalReporte = false;
  reporteForm: FormGroup;

  idChoferActual = 1; 
  viajeActual: any = null;
  rutaInfo: any = null;
  errorViaje = '';

  trazadoBase: PuntoRuta[] = [];
  rutaRutaAsignada: PuntoRuta[] = []; 
  tipoRutaActual: 'IDA' | 'VUELTA' = 'IDA';
  ubicacionActualChofer: PuntoRuta | null = null;


  constructor() {
    this.reporteForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(40)]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.cargarViajeDelDia();
  }

  cargarViajeDelDia(): void {
    this.errorViaje = '';

    this.viajesService.obtenerViajeDia(this.idChoferActual).subscribe({
      next: (data) => {
        if (data) {
          this.rutaInfo = data;

          if (data.estado === 'ACTIVO' && data.id_viaje) {
            this.viajeActual = data;
          } else {
            this.viajeActual = null;
          }

          if (this.rutaInfo.id_ruta) {
            this.cargarTrazadoMapa(this.rutaInfo.id_ruta);
          }
        } else {
          this.rutaInfo = null;
          this.viajeActual = null;
          this.errorViaje = 'No hay una ruta asignada para este chofer.';
        }

        this.cdr.detectChanges();
      },
      error: () => {
        this.rutaInfo = null;
        this.viajeActual = null;
        this.errorViaje = 'No hay una ruta asignada para este chofer.';
        this.cdr.detectChanges();
      }
    });
  }

  cargarTrazadoMapa(idRuta: number): void {
    this.viajesService.obtenerTrazadoRuta(idRuta).subscribe({
      next: (coordenadas) => {
        this.trazadoBase = coordenadas; 
        
        const puntosGuardados = localStorage.getItem('rutaPuntosGuardados');
        const tipoGuardado = localStorage.getItem('tipoRutaGuardada') as 'IDA' | 'VUELTA' | null;

        if (puntosGuardados && this.viajeActual?.estado === 'ACTIVO') {
          try {
            this.rutaRutaAsignada = JSON.parse(puntosGuardados);
            if (tipoGuardado) this.tipoRutaActual = tipoGuardado;
          } catch (e) {
            this.rutaRutaAsignada = this.tipoRutaActual === 'VUELTA' 
              ? [...coordenadas].reverse() 
              : [...coordenadas];
          }
        } else {
          this.rutaRutaAsignada = this.tipoRutaActual === 'VUELTA' 
            ? [...coordenadas].reverse() 
            : [...coordenadas];
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando trazado', err);
        this.cdr.detectChanges();
      }
    });
  }

  iniciarRuta(tipo: 'IDA' | 'VUELTA' = 'IDA'): void {
    if (!this.rutaInfo) return;

    this.tipoRutaActual = tipo;
    if (this.trazadoBase.length > 0) {
      this.rutaRutaAsignada = tipo === 'VUELTA' 
        ? [...this.trazadoBase].reverse() 
        : [...this.trazadoBase];
    }

    localStorage.setItem('rutaPuntosGuardados', JSON.stringify(this.rutaRutaAsignada));
    localStorage.setItem('tipoRutaGuardada', this.tipoRutaActual);

    this.viajesService.iniciarRutaViaje(this.idChoferActual).subscribe({
      next: (res) => {
        this.viajeActual = {
          ...res,
          estado: 'ACTIVO'
        };
        this.cdr.detectChanges();
        alert(`Ruta de ${tipo === 'IDA' ? 'ida' : 'vuelta'} iniciada con éxito. El viaje se registró en la base de datos (ID Viaje: ${res.id_viaje}) y el GPS fue activado.`);
      },
      error: (err) => {
        console.error('Error al iniciar la ruta:', err);
        alert(err.error?.error || 'Hubo un error al iniciar la ruta');
        this.cdr.detectChanges();
      }
    });
  }

  registrarAbordaje(): void {
    if (this.viajeActual?.estado !== 'ACTIVO' || this.tipoRutaActual !== 'IDA') return;

    if (this.rutaRutaAsignada.length > 0) {
      this.rutaRutaAsignada = [...this.rutaRutaAsignada.slice(1)];
      localStorage.setItem('rutaPuntosGuardados', JSON.stringify(this.rutaRutaAsignada));
      localStorage.setItem('tipoRutaGuardada', this.tipoRutaActual);
      this.cdr.detectChanges();
    }

    if (this.rutaRutaAsignada.length === 0) {
      this.viajesService.finalizarRutaViaje(this.viajeActual.id_viaje).subscribe({
        next: (res) => {
          this.viajeActual = {
            ...this.viajeActual,
            ...res,
            estado: 'FINALIZADO'
          };
          localStorage.removeItem('rutaPuntosGuardados');
          localStorage.removeItem('tipoRutaGuardada');
          this.cdr.detectChanges();
          alert('¡Abordaje y ruta completados! El viaje ha finalizado con éxito y quedó guardado en la base de datos.');
        },
        error: (err) => {
          console.error('Error al finalizar el viaje:', err);
          alert(err.error?.error || 'Hubo un error al finalizar la ruta en el servidor.');
          this.cdr.detectChanges();
        }
      });
    }
  }

  registrarDescenso(): void {
    if (this.viajeActual?.estado !== 'ACTIVO' || this.tipoRutaActual !== 'VUELTA') return;

    if (this.rutaRutaAsignada.length > 0) {
      this.rutaRutaAsignada = [...this.rutaRutaAsignada.slice(1)];
      localStorage.setItem('rutaPuntosGuardados', JSON.stringify(this.rutaRutaAsignada));
      localStorage.setItem('tipoRutaGuardada', this.tipoRutaActual);
      this.cdr.detectChanges();
    }

    if (this.rutaRutaAsignada.length === 0) {
      this.viajesService.finalizarRutaViaje(this.viajeActual.id_viaje).subscribe({
        next: (res) => {
          this.viajeActual = {
            ...this.viajeActual,
            ...res,
            estado: 'FINALIZADO'
          };
          localStorage.removeItem('rutaPuntosGuardados');
          localStorage.removeItem('tipoRutaGuardada');
          this.cdr.detectChanges();
          alert('¡Descenso y ruta de vuelta completados! El viaje ha finalizado con éxito y quedó guardado en la base de datos.');
        },
        error: (err) => {
          console.error('Error al finalizar el viaje:', err);
          alert(err.error?.error || 'Hubo un error al finalizar la ruta en el servidor.');
          this.cdr.detectChanges();
        }
      });
    }
  }

  enviarUbicacionAlServidor(coordenadas: PuntoRuta): void {
    this.ubicacionActualChofer = coordenadas;
    if (this.viajeActual?.estado === 'ACTIVO') {
      this.viajesService.registrarUbicacionBus(this.viajeActual.id_viaje, coordenadas)
        .subscribe({
          error: (err) => console.error('Error guardando GPS', err)
        });
    }
  }

  // --- Modal de Reportes ---
  abrirModalReporte(): void { this.mostrarModalReporte = true; }
  cerrarModalReporte(): void { 
    this.mostrarModalReporte = false; 
    this.reporteForm.reset(); 
  }
  crearReporte(): void {
    if (this.reporteForm.invalid) return;

    const formValues = this.reporteForm.value;

    const enviarReporteConUbicacion = (lat: number, lng: number) => {
      const idViaje = Number(this.viajeActual?.id_viaje) || 1;
      const idRuta = Number(this.viajeActual?.id_ruta || this.rutaInfo?.id_ruta) || 1;

      const newReporte: Incidencias = {
        id_viaje: idViaje,
        id_ruta: idRuta,
        id_usuario_reporta: Number(this.idChoferActual) || 1,
        titulo: formValues.titulo,
        descripcion: formValues.descripcion || '',
        latitud: Number(lat),
        longitud: Number(lng),
        fecha_hora: new Date(),
        estado: 'ABIERTA'
      };

      console.log('Datos que se enviarán al servidor (con GPS):', newReporte);

      this.viajesService.enviarReporte(newReporte).subscribe({
        next: (respuesta) => {
          console.log('Reporte creado correctamente:', respuesta);
          alert('¡El reporte ha sido enviado con éxito con la ubicación actual del chofer!');
          this.cerrarModalReporte();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al crear el reporte:', error);
          alert(error?.error?.error || error?.error?.message || 'No se pudo enviar el reporte. Por favor inténtalo de nuevo.');
          this.cdr.detectChanges();
        }
      });
    };

    if (this.ubicacionActualChofer) {
      enviarReporteConUbicacion(this.ubicacionActualChofer.lat, this.ubicacionActualChofer.lng);
    } else if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          this.ubicacionActualChofer = { lat, lng };
          enviarReporteConUbicacion(lat, lng);
        },
        (err) => {
          console.warn('Geolocalización GPS no disponible, usando coordenadas del mapa:', err);
          const fallbackLat = this.rutaRutaAsignada.length > 0 ? this.rutaRutaAsignada[0].lat : 14.6349;
          const fallbackLng = this.rutaRutaAsignada.length > 0 ? this.rutaRutaAsignada[0].lng : -90.5069;
          enviarReporteConUbicacion(fallbackLat, fallbackLng);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      const fallbackLat = this.rutaRutaAsignada.length > 0 ? this.rutaRutaAsignada[0].lat : 14.6349;
      const fallbackLng = this.rutaRutaAsignada.length > 0 ? this.rutaRutaAsignada[0].lng : -90.5069;
      enviarReporteConUbicacion(fallbackLat, fallbackLng);
    }
  }
}