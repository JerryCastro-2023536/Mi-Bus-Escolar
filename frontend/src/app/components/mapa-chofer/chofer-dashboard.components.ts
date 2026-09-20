import { Component, OnInit, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PuntoRuta } from '../../models/mapas.type';
import { MapaComponent } from '../mapa/mapa.component';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { rutasService, EstudianteAsistenciaDTO } from '../../services/rutas.service';
import { Incidencias } from '../../models/incidencias';
import { LoginService } from '../../services/login';

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
  private loginService = inject(LoginService);

  mostrarModalReporte = false;
  reporteForm: FormGroup;

  // IDs resueltos desde el usuario autenticado
  idUsuarioActual: number = 0;
  idChoferActual: number = 0;
  cargandoChofer = true;

  viajeActual: any = null;
  rutaInfo: any = null;
  errorViaje = '';

  trazadoBase: PuntoRuta[] = [];
  rutaRutaAsignada: PuntoRuta[] = [];
  tipoRutaActual: 'IDA' | 'VUELTA' = 'IDA';
  ubicacionActualChofer: PuntoRuta | null = null;

  // --- Flujo de Asistencia ---
  mostrarModalAsistencia = false;
  tipoAsistenciaModal: 'IDA' | 'VUELTA' = 'IDA';
  estudiantesAsistencia: EstudianteAsistenciaDTO[] = [];
  cargandoAsistencia = false;
  asistenciaIdaTomada = false;
  asistenciaVueltaTomada = false;
  guardandoAsistencia = false;

  constructor() {
    this.reporteForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(40)]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.resolverIdentidadChofer();
  }

  /** Paso 1: Obtener id_chofer a partir del usuario autenticado */
  resolverIdentidadChofer(): void {
    const user = this.loginService.getUser();
    const userId = user?.id_usuario || user?.id;

    if (user?.id_chofer) {
      this.idUsuarioActual = userId || 1;
      this.idChoferActual = Number(user.id_chofer);
      this.cargandoChofer = false;
      this.cargarViajeDelDia();
      return;
    }

    const idConsulta = userId || 1;
    this.idUsuarioActual = idConsulta;

    this.viajesService.resolverChofer(idConsulta).subscribe({
      next: (res) => {
        this.idChoferActual = res?.id_chofer ? Number(res.id_chofer) : 1;
        if (user) {
          this.loginService.saveUser({ ...user, id_chofer: this.idChoferActual });
        }
        this.cargandoChofer = false;
        this.cargarViajeDelDia();
      },
      error: () => {
        this.idChoferActual = 1;
        this.cargandoChofer = false;
        this.cargarViajeDelDia();
      }
    });
  }

  /** Paso 2: Cargar la ruta y viaje activo directamente desde la base de datos */
  cargarViajeDelDia(): void {
    this.errorViaje = '';
    const idChofer = Number(this.idChoferActual) || 1;

    this.viajesService.obtenerViajeDia(idChofer).subscribe({
      next: (data) => {
        if (data && data.id_ruta) {
          this.rutaInfo = data;

          if (data.estado === 'ACTIVO' && data.id_viaje) {
            this.viajeActual = data;
            
            // LÍNEAS NUEVAS: Fuerza el estado IDA_COMPLETADA si ya lo habías logrado localmente
            const viajeGuardado = localStorage.getItem('viajeActualGuardado');
            if (viajeGuardado) {
              const parsed = JSON.parse(viajeGuardado);
              if (parsed.id_viaje === data.id_viaje && parsed.tipo_ruta === 'IDA_COMPLETADA') {
                this.viajeActual.tipo_ruta = 'IDA_COMPLETADA';
              }
            }

        
            localStorage.setItem('viajeActualGuardado', JSON.stringify(this.viajeActual));


            if (localStorage.getItem('asistenciaIda_' + data.id_viaje) === 'true') {
              this.asistenciaIdaTomada = true;
            }
            if (localStorage.getItem('asistenciaVuelta_' + data.id_viaje) === 'true') {
              this.asistenciaVueltaTomada = true;
            }
          } else {
            this.viajeActual = null;
            this.tipoRutaActual = 'IDA';
            this.asistenciaIdaTomada = false;
            this.asistenciaVueltaTomada = false;
          }

          this.cargarTrazadoMapa(Number(this.rutaInfo.id_ruta));
        } else {
          this.rutaInfo = null;
          this.viajeActual = null;
          this.errorViaje = 'No hay una ruta asignada para este chofer en la base de datos.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener viaje/ruta:', err);
        this.rutaInfo = null;
        this.viajeActual = null;
        this.errorViaje = 'No se pudo cargar la ruta desde el servidor.';
        this.cdr.detectChanges();
      }
    });
  }

  /** Paso 3: Cargar paradas y coordenadas de la base de datos */
  cargarTrazadoMapa(idRuta: number): void {
    this.viajesService.obtenerTrazadoRuta(idRuta).subscribe({
      next: (coordenadas) => {
        if (coordenadas && coordenadas.length > 0) {
          this.trazadoBase = coordenadas;
          
          // SOLUCIÓN: Leer el progreso guardado en memoria
          const puntosGuardados = localStorage.getItem('rutaPuntosGuardados');
          
          if (puntosGuardados && this.viajeActual?.estado === 'ACTIVO') {
            this.rutaRutaAsignada = JSON.parse(puntosGuardados);
          } else {
            this.rutaRutaAsignada = this.tipoRutaActual === 'VUELTA'
              ? [...coordenadas].reverse()
              : [...coordenadas];
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando trazado desde la BD:', err);
        this.cdr.detectChanges();
      }
    });
  }

  // ─── FLUJO DE ASISTENCIA ────────────────────────────────────────────

  tomarAsistencia(tipo: 'IDA' | 'VUELTA'): void {
    if (!this.rutaInfo) return;
    this.tipoAsistenciaModal = tipo;
    this.cargandoAsistencia = true;
    this.mostrarModalAsistencia = true;

    const idViaje = this.viajeActual?.id_viaje;
    this.viajesService.obtenerEstudiantesAsistencia(this.idChoferActual, idViaje).subscribe({
      next: (lista) => {
        this.estudiantesAsistencia = lista.map(e => ({
          ...e,
          marcaLocal: (e.estado_abordaje === 'AUSENTE' ? 'AUSENTE' : 'PRESENTE') as 'PRESENTE' | 'AUSENTE'
        }));
        this.cargandoAsistencia = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoAsistencia = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleMarcaEstudiante(idEstudiante: number): void {
    this.estudiantesAsistencia = this.estudiantesAsistencia.map(e =>
      e.id_estudiante === idEstudiante
        ? { ...e, marcaLocal: e.marcaLocal === 'PRESENTE' ? 'AUSENTE' : 'PRESENTE' }
        : e
    );
  }

  get conteoPresentes(): number {
    return this.estudiantesAsistencia.filter(e => e.marcaLocal === 'PRESENTE').length;
  }

  get conteoAusentes(): number {
    return this.estudiantesAsistencia.filter(e => e.marcaLocal === 'AUSENTE').length;
  }

  confirmarAsistencia(): void {
    if (this.guardandoAsistencia || !this.viajeActual?.id_viaje) return;

    const idViaje = this.viajeActual.id_viaje;

    if (this.tipoAsistenciaModal === 'IDA') {
      this.asistenciaIdaTomada = true;
      localStorage.setItem('asistenciaIda_' + idViaje, 'true');
    } else {
      this.asistenciaVueltaTomada = true;
      localStorage.setItem('asistenciaVuelta_' + idViaje, 'true');
    }

    this.guardandoAsistencia = true;
    const presentes = this.estudiantesAsistencia.filter(e => e.marcaLocal === 'PRESENTE');
    const ausentes = this.estudiantesAsistencia.filter(e => e.marcaLocal === 'AUSENTE');

    const ops = [
      ...presentes.map(e => this.viajesService.marcarAbordaje(idViaje, e.id_estudiante)),
      ...ausentes.map(e => this.viajesService.marcarAusente(idViaje, e.id_estudiante))
    ];

    const finalizarConfirmacion = () => {
      this.guardandoAsistencia = false;
      this.mostrarModalAsistencia = false;

      if (this.rutaInfo?.id_ruta) {
        this.viajesService.obtenerTrazadoAsistencia(this.rutaInfo.id_ruta, idViaje, this.tipoAsistenciaModal).subscribe({
          next: (puntosFiltrados) => {
            if (puntosFiltrados && puntosFiltrados.length >= 2) {
              this.rutaRutaAsignada = puntosFiltrados;
            }
            localStorage.setItem('rutaPuntosGuardados', JSON.stringify(this.rutaRutaAsignada));
            this.cdr.detectChanges();
          },
          error: () => {
            this.cdr.detectChanges();
          }
        });
      } else {
        this.cdr.detectChanges();
      }
    };

    if (ops.length === 0) {
      finalizarConfirmacion();
      return;
    }

    let completados = 0;
    ops.forEach(op => op.subscribe({
      next: () => {
        completados++;
        if (completados === ops.length) {
          finalizarConfirmacion();
        }
      },
      error: () => {
        completados++;
        if (completados === ops.length) {
          finalizarConfirmacion();
        }
      }
    }));
  }

  cerrarModalAsistencia(): void {
    this.mostrarModalAsistencia = false;
    this.cdr.detectChanges();
  }

  // ─── FLUJO DE RUTA ──────────────────────────────────────────────────

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

    // SOLUCIÓN: Quitamos el 'if' que bloqueaba el llamado al servicio.
    // Ahora el backend siempre sabrá en qué fase de la ruta estamos.
    
    this.viajesService.iniciarRutaViaje(this.idChoferActual, tipo).subscribe({
      next: (res) => {
        this.viajeActual = { ...res, estado: 'ACTIVO', tipo_ruta: tipo };
        localStorage.setItem('viajeActualGuardado', JSON.stringify(this.viajeActual));
        
        if (tipo === 'IDA') {
          this.asistenciaIdaTomada = false;
        } else {
          this.asistenciaVueltaTomada = false;
        }
        this.cdr.detectChanges();
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

    if (this.viajeActual?.id_viaje && this.estudiantesAsistencia.length > 0) {
      const presentes = this.estudiantesAsistencia.filter(e => e.marcaLocal === 'PRESENTE' || e.estado_abordaje === 'PRESENTE');
      presentes.forEach(e => {
        this.viajesService.marcarAbordaje(this.viajeActual.id_viaje, e.id_estudiante).subscribe();
      });
    }

    if (this.rutaRutaAsignada.length > 1) { 
      this.rutaRutaAsignada = [...this.rutaRutaAsignada.slice(1)];
      localStorage.setItem('rutaPuntosGuardados', JSON.stringify(this.rutaRutaAsignada));
      localStorage.setItem('tipoRutaGuardada', this.tipoRutaActual);
      this.cdr.detectChanges();
    } else {
      this.rutaRutaAsignada = [];
      const idViaje = this.viajeActual?.id_viaje;
      this.viajeActual = { ...this.viajeActual, estado: 'ACTIVO', tipo_ruta: 'IDA_COMPLETADA' };
      localStorage.setItem('viajeActualGuardado', JSON.stringify(this.viajeActual));
      localStorage.setItem('tipoRutaGuardada', 'IDA');
      
      localStorage.removeItem('rutaPuntosGuardados'); 
      
      if (idViaje) {
        localStorage.removeItem('asistenciaIda_' + idViaje);
      }
      this.cdr.detectChanges();
      alert('¡Abordaje de ida completado! Ahora puedes iniciar la ruta de vuelta.');
    }
  }

  registrarDescenso(): void {
    if (this.viajeActual?.estado !== 'ACTIVO' || this.tipoRutaActual !== 'VUELTA') return;

    if (this.viajeActual?.id_viaje && this.estudiantesAsistencia.length > 0) {
      const presentes = this.estudiantesAsistencia.filter(e => e.marcaLocal === 'PRESENTE' || e.estado_abordaje === 'PRESENTE');
      presentes.forEach(e => {
        this.viajesService.marcarDescenso(this.viajeActual.id_viaje, e.id_estudiante).subscribe();
      });
    }

    if (this.rutaRutaAsignada.length > 1) { 
      this.rutaRutaAsignada = [...this.rutaRutaAsignada.slice(1)];
      localStorage.setItem('rutaPuntosGuardados', JSON.stringify(this.rutaRutaAsignada));
      localStorage.setItem('tipoRutaGuardada', this.tipoRutaActual);
      this.cdr.detectChanges();
    } else {
      const idFinalizado = this.viajeActual?.id_viaje;
      this.viajesService.finalizarRutaViaje(this.viajeActual.id_viaje).subscribe({
        next: (res) => {
          this.viajeActual = {
            ...this.viajeActual,
            ...res,
            estado: 'FINALIZADO'
          };
          
          // SOLUCIÓN: Eliminada la línea this.cargarViajeDelDia(); de aquí
          this.errorViaje = 'Ruta finalizada correctamente.';
          
          localStorage.removeItem('viajeActualGuardado');
          localStorage.removeItem('rutaPuntosGuardados');
          localStorage.removeItem('tipoRutaGuardada');
          if (idFinalizado) {
            localStorage.removeItem('asistenciaIda_' + idFinalizado);
            localStorage.removeItem('asistenciaVuelta_' + idFinalizado);
          }
          this.cdr.detectChanges();
          alert('¡Descenso y ruta de vuelta completados! El viaje ha finalizado con éxito.');
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

      this.viajesService.enviarReporte(newReporte).subscribe({
        next: () => {
          alert('¡El reporte ha sido enviado con éxito con la ubicación actual del chofer!');
          this.cerrarModalReporte();
          this.cdr.detectChanges();
        },
        error: (error) => {
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
        () => {
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