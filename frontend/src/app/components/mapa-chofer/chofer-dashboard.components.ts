import { Component, OnInit, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { PuntoRuta } from '../../models/mapas.type';
import { MapaComponent } from '../mapa/mapa.component';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { rutasService, EstudianteAsistenciaDTO } from '../../services/rutas.service';
import { Incidencias } from '../../models/incidencias';
import { LoginService } from '../../services/login';
import { TipoNoti } from '../../models/asistenciasDTO.interface';

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

  idUsuarioActual: number = 0;
  idChoferActual: number = 0;
  idProveedorActual: number = 0;
  idUsuarioProveedor: number = 0;
  cargandoChofer = true;

  viajeActual: any = null;
  rutaInfo: any = null;
  errorViaje = '';

  trazadoBase: PuntoRuta[] = [];
  rutaRutaAsignada: PuntoRuta[] = [];
  tipoRutaActual: 'IDA' | 'VUELTA' = 'IDA';
  ubicacionActualChofer: PuntoRuta | null = null;

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

  resolverIdentidadChofer(): void {
    const user = this.loginService.getUser();
    const userId = user?.id_usuario || user?.id;

    if (user?.id_chofer) {
      this.idUsuarioActual = userId || 1;
      this.idChoferActual = Number(user.id_chofer);
      this.cargandoChofer = false;
      this.obtenerProveedorDelChofer();
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
        this.obtenerProveedorDelChofer();
        this.cargarViajeDelDia();
      },
      error: () => {
        this.idChoferActual = 1;
        this.cargandoChofer = false;
        this.obtenerProveedorDelChofer();
        this.cargarViajeDelDia();
      }
    });
  }

  obtenerProveedorDelChofer(): void {
    this.viajesService.obtenerProveedorChofer(this.idChoferActual).subscribe({
      next: (res) => {
        this.idProveedorActual = res?.id_proveedor || 1;
        this.idUsuarioProveedor = res?.id_usuario_proveedor || 0;
      },
      error: () => {
        this.idProveedorActual = 1;
        this.idUsuarioProveedor = 0;
      }
    });
  }

  cargarViajeDelDia(): void {
    this.errorViaje = '';
    const idChofer = Number(this.idChoferActual) || 1;

    this.viajesService.obtenerViajeDia(idChofer).subscribe({
      next: (data) => {
        if (data && data.id_ruta) {
          this.rutaInfo = data;

          if (data.estado === 'ACTIVO' && data.id_viaje) {
            this.viajeActual = data;
            
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

  cargarTrazadoMapa(idRuta: number): void {
    this.viajesService.obtenerTrazadoRuta(idRuta).subscribe({
      next: (coordenadas) => {
        if (coordenadas && coordenadas.length > 0) {
          this.trazadoBase = coordenadas;
          
          const puntosGuardados = localStorage.getItem('rutaPuntosGuardados');
          
          if (puntosGuardados && this.viajeActual?.estado === 'ACTIVO') {
            this.rutaRutaAsignada = JSON.parse(puntosGuardados);
          } else {
            this.rutaRutaAsignada = this.tipoRutaActual === 'VUELTA'
              ? [...coordenadas].reverse()
              : [...coordenadas];
          }
          if (this.viajeActual?.id_viaje && this.viajeActual?.estado === 'ACTIVO') {
            this.actualizarTrazadoEnServidor();
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

  actualizarTrazadoEnServidor(): void {
    if (this.viajeActual?.id_viaje && this.rutaRutaAsignada) {
      this.viajesService.guardarTrazadoActivo(this.viajeActual.id_viaje, this.rutaRutaAsignada).subscribe();
    }
  }

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

    const ops = this.tipoAsistenciaModal === 'IDA'
      ? [
          ...presentes.map(e => this.viajesService.marcarAbordaje(idViaje, e.id_estudiante)),
          ...ausentes.map(e => this.viajesService.marcarAusente(idViaje, e.id_estudiante))
        ]
      : [
          ...presentes.map(e => this.viajesService.marcarDescenso(idViaje, e.id_estudiante)),
          ...ausentes.map(e => this.viajesService.marcarAusente(idViaje, e.id_estudiante))
        ];

    const finalizarConfirmacion = () => {
      this.guardandoAsistencia = false;
      this.mostrarModalAsistencia = false;

      if (this.rutaInfo?.id_ruta) {
        this.viajesService.obtenerTrazadoAsistencia(this.rutaInfo.id_ruta, idViaje, this.tipoAsistenciaModal).subscribe({
          next: (puntosFiltrados) => {
            if (puntosFiltrados && puntosFiltrados.length >= 3) {
              this.rutaRutaAsignada = puntosFiltrados;
            } else {
              this.rutaRutaAsignada = this.tipoRutaActual === 'VUELTA'
                ? [...(this.trazadoBase ?? [])].reverse()
                : [...(this.trazadoBase ?? [])];
            }
            localStorage.setItem('rutaPuntosGuardados', JSON.stringify(this.rutaRutaAsignada));
            this.actualizarTrazadoEnServidor();
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

    this.viajesService.iniciarRutaViaje(this.idChoferActual, tipo).subscribe({
      next: (res) => {
        this.viajeActual = { ...res, estado: 'ACTIVO', tipo_ruta: tipo };
        localStorage.setItem('viajeActualGuardado', JSON.stringify(this.viajeActual));
        this.actualizarTrazadoEnServidor();
        
        if (tipo === 'IDA') {
          this.asistenciaIdaTomada = false;
        } else {
          this.asistenciaVueltaTomada = false;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al iniciar la ruta:', err);
        Swal.fire({
          icon: 'error',
          title: 'No se pudo iniciar la ruta',
          text: err?.error?.error || 'Hubo un error al iniciar la ruta.',
          showCancelButton: false,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#1A456B',
          customClass: {
            confirmButton: 'swal-brand-btn'
          }
        });
        this.cdr.detectChanges();
      }
    });
  }

  registrarAbordaje(): void {
    if (this.viajeActual?.estado !== 'ACTIVO' || this.tipoRutaActual !== 'IDA') return;

    if (this.rutaRutaAsignada.length > 1) { 
      this.rutaRutaAsignada = [...this.rutaRutaAsignada.slice(1)];
      localStorage.setItem('rutaPuntosGuardados', JSON.stringify(this.rutaRutaAsignada));
      localStorage.setItem('tipoRutaGuardada', this.tipoRutaActual);
      this.actualizarTrazadoEnServidor();
      this.cdr.detectChanges();
    } else {
      this.rutaRutaAsignada = [];
      const idViaje = this.viajeActual?.id_viaje;
      this.viajeActual = { ...this.viajeActual, estado: 'ACTIVO', tipo_ruta: 'IDA_COMPLETADA' };
      localStorage.setItem('viajeActualGuardado', JSON.stringify(this.viajeActual));
      localStorage.setItem('tipoRutaGuardada', 'IDA');
      
      localStorage.removeItem('rutaPuntosGuardados'); 
      this.actualizarTrazadoEnServidor();
      
      if (idViaje) {
        localStorage.removeItem('asistenciaIda_' + idViaje);
      }
      this.cdr.detectChanges();
      Swal.fire({
        icon: 'success',
        title: 'Abordaje completado',
        text: '¡Abordaje de ida completado! Ahora puedes iniciar la ruta de vuelta.',
        showCancelButton: false,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#1A456B',
        customClass: {
          confirmButton: 'swal-brand-btn',
          title: 'swal-brand-title',
          popup: 'swal-brand-popup',
        }
      });
    }
  }

  registrarDescenso(): void {
    if (this.viajeActual?.estado !== 'ACTIVO' || this.tipoRutaActual !== 'VUELTA') return;

    if (this.rutaRutaAsignada.length > 1) { 
      this.rutaRutaAsignada = [...this.rutaRutaAsignada.slice(1)];
      localStorage.setItem('rutaPuntosGuardados', JSON.stringify(this.rutaRutaAsignada));
      localStorage.setItem('tipoRutaGuardada', this.tipoRutaActual);
      this.actualizarTrazadoEnServidor();
      this.cdr.detectChanges();
    } else {
      this.rutaRutaAsignada = [];
      this.actualizarTrazadoEnServidor();
      if (this.viajeActual?.id_viaje && this.estudiantesAsistencia.length > 0) {
        const presentes = this.estudiantesAsistencia.filter(e => e.marcaLocal === 'PRESENTE' && e.estado_abordaje !== 'AUSENTE');
        presentes.forEach(e => {
          this.viajesService.marcarDescenso(this.viajeActual.id_viaje, e.id_estudiante).subscribe();
        });
      }

      const idFinalizado = this.viajeActual?.id_viaje;
      this.viajesService.finalizarRutaViaje(this.viajeActual.id_viaje).subscribe({
        next: (res) => {
          this.viajeActual = {
            ...this.viajeActual,
            ...res,
            estado: 'FINALIZADO'
          };
          
          this.errorViaje = 'Ruta finalizada correctamente.';
          
          localStorage.removeItem('viajeActualGuardado');
          localStorage.removeItem('rutaPuntosGuardados');
          localStorage.removeItem('tipoRutaGuardada');
          if (idFinalizado) {
            localStorage.removeItem('asistenciaIda_' + idFinalizado);
            localStorage.removeItem('asistenciaVuelta_' + idFinalizado);
          }
          this.cdr.detectChanges();
          Swal.fire({
            icon: 'success',
            title: 'Ruta finalizada',
            text: '¡Descenso y ruta de vuelta completados! El viaje ha finalizado con éxito.',
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#1A456B',
            customClass: {
              confirmButton: 'swal-brand-btn',
              popup: 'swal-brand-popup',
              title: 'swal-brand-title',
            }
          });
        },
        error: (err) => {
          console.error('Error al finalizar el viaje:', err);
          Swal.fire({
            icon: 'error',
            title: 'No se pudo finalizar la ruta',
            text: err?.error?.error || 'Hubo un error al finalizar la ruta en el servidor.',
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#1A456B',
            customClass: {
              confirmButton: 'swal-brand-btn'
            }
          });
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
        next: (res) => {
          const idIncidencia = Number(res.id_incidencia);

          if (!this.idUsuarioProveedor || this.idUsuarioProveedor <= 0) {
              console.error('No se pudo resolver el id_usuario del proveedor para la notificación.');
              Swal.fire({
                icon: 'warning',
                title: 'Reporte guardado',
                text: 'El reporte fue creado, pero no se pudo notificar al proveedor (usuario no encontrado).',
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#1A456B',
                customClass: {
                  confirmButton: 'swal-brand-btn'
                }
              });
              this.cerrarModalReporte();
              this.cdr.detectChanges();
              return;
          }

          const notificacion = {
            id_usuario: this.idUsuarioProveedor,
            id_incidencia: idIncidencia,
            id_asistencia: null,
            tipo: 'INCIDENTE' as TipoNoti,
            titulo: 'Nuevo reporte de incidencia',
            mensaje: `El chofer ha registrado un nuevo reporte: ${newReporte.titulo}`,
            leida: false,
            fecha_envio: new Date()
          };

          this.viajesService.enviarNotificacion(notificacion).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Reporte enviado',
                text: '¡El reporte y la notificación fueron enviados correctamente!',
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#1A456B',
                customClass: {
                  confirmButton: 'swal-brand-btn'
                }
              });
              this.cerrarModalReporte();
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error('Reporte creado, pero no se pudo enviar la notificación:', error);
              Swal.fire({
                icon: 'warning',
                title: 'Reporte creado',
                text: 'El reporte fue creado, pero no se pudo enviar la notificación.',
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#1A456B',
                customClass: {
                  confirmButton: 'swal-brand-btn'
                }
              });
              this.cerrarModalReporte();
              this.cdr.detectChanges();
            }
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo enviar el reporte',
            text: error?.error?.error || error?.error?.message || 'No se pudo enviar el reporte. Por favor inténtalo de nuevo.',
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#1A456B',
            customClass: {
              confirmButton: 'swal-brand-btn'
            }
          });
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