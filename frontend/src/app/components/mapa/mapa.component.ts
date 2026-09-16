import {
  Component,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PuntoRuta, RolMapa } from '../../models/mapas.type';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input({ required: true }) rol!: RolMapa;
  @Input() rutaDefinida: PuntoRuta[] = [];
  @Input() posicionChofer?: PuntoRuta;

  @Input() puntoSeleccionado?: PuntoRuta;
  @Output() cambioUbicacion = new EventEmitter<PuntoRuta>();

  private mapa: any;
  private platformId = inject(PLATFORM_ID);
  private controlRuta: any;
  private seguimientoGPS: number | null = null;
  private L: any;
  private marcadorChofer: any;
  private marcadorPunto: any; 

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.inicializarMapa();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mapa && changes['posicionChofer'] && this.posicionChofer) {
      if (this.rol === 'usuario' || this.rol === 'proveedor') {
        this.actualizarPosicionRemotaChofer(this.posicionChofer);
      }
    }

    if (this.mapa && changes['puntoSeleccionado'] && this.puntoSeleccionado) {
      this.actualizarMarcadorPunto(this.puntoSeleccionado);
    }
  }

  private async inicializarMapa(): Promise<void> {
    this.L = await import('leaflet');
    (window as any).L = this.L;
    await import('leaflet-routing-machine');

    const centroInicial: [number, number] = this.puntoSeleccionado
      ? [this.puntoSeleccionado.lat, this.puntoSeleccionado.lng]
      : this.rutaDefinida.length > 0
        ? [this.rutaDefinida[0].lat, this.rutaDefinida[0].lng]
        : [14.6349, -90.5069]; 
    this.mapa = this.L.map('mapa').setView(centroInicial, 14);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.mapa);

    const defaultIcon = this.L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    this.L.Marker.prototype.options.icon = defaultIcon;

    requestAnimationFrame(() => {
      this.mapa?.invalidateSize();
    });

    setTimeout(() => {
      this.mapa?.invalidateSize();
    }, 300);

    if (this.rol === 'chofer') {
      this.iniciarGpsChofer();
    } else {
      if (this.rutaDefinida.length > 0) {
        this.trazarRuta(this.rutaDefinida);
      }

      if (this.rol === 'admin' || this.rol === 'usuario') {
        const puntoInicial: PuntoRuta = this.puntoSeleccionado ?? {
          lat: centroInicial[0],
          lng: centroInicial[1]
        };

        this.actualizarMarcadorPunto(puntoInicial);
        this.cambioUbicacion.emit(puntoInicial);
        this.habilitarSeleccionPunto();
      }
    }
  }

  private habilitarSeleccionPunto(): void {
    this.mapa.on('click', (e: any) => {
      const nuevaCoordenada: PuntoRuta = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };

      this.actualizarMarcadorPunto(nuevaCoordenada);
      this.cambioUbicacion.emit(nuevaCoordenada);
    });
  }

  private actualizarMarcadorPunto(punto: PuntoRuta): void {
    if (!this.L || !this.mapa) return;

    const esEditable = this.rol === 'admin' || this.rol === 'usuario';

    const iconoPersonalizado = this.L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });

    if (!this.marcadorPunto) {
      this.marcadorPunto = this.L.marker([punto.lat, punto.lng], {
        icon: iconoPersonalizado,
        draggable: esEditable
      }).addTo(this.mapa);

      if (esEditable) {
        this.marcadorPunto.on('dragend', () => {
          const position = this.marcadorPunto.getLatLng();
          const nuevaCoordenada: PuntoRuta = { lat: position.lat, lng: position.lng };
          this.cambioUbicacion.emit(nuevaCoordenada);
        });
      }
    } else {
      this.marcadorPunto.setLatLng([punto.lat, punto.lng]);
    }

    this.mapa.panTo([punto.lat, punto.lng]);
  }

  private trazarRuta(puntos: PuntoRuta[]): void {
    if (!puntos || puntos.length < 2 || !this.L) return;

    const waypoints = puntos.map(p => this.L.latLng(p.lat, p.lng));

    if (this.controlRuta) {
      this.controlRuta.setWaypoints(waypoints);
    } else {
      this.controlRuta = (this.L as any).Routing.control({
        waypoints: waypoints,
        lineOptions: { styles: [{ color: '#242c81', weight: 6, opacity: 0.8 }] },
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        show: false,
      }).addTo(this.mapa);
    }
  }

  private iniciarGpsChofer(): void {
    if (!('geolocation' in navigator)) {
      alert('Tu navegador no soporta geolocalización');
      this.trazarRuta(this.rutaDefinida);
      return;
    }

    this.seguimientoGPS = navigator.geolocation.watchPosition(
      (posicion) => {
        const lat = posicion.coords.latitude;
        const lng = posicion.coords.longitude;
        const puntoGps = { lat, lng };

        if (!this.marcadorChofer) {
          this.marcadorChofer = this.L.marker([lat, lng])
            .bindPopup('<b>Tu ubicación (Chofer)</b>')
            .addTo(this.mapa);
        } else {
          this.marcadorChofer.setLatLng([lat, lng]);
        }

        this.mapa.panTo([lat, lng]);

        const rutaCompleta = [puntoGps, ...this.rutaDefinida];
        this.trazarRuta(rutaCompleta);

        this.cambioUbicacion.emit(puntoGps);
      },
      (error) => {
        console.error('Error GPS Chofer:', error);
        alert('Por favor autoriza los permisos de ubicación en tu navegador.');
        this.trazarRuta(this.rutaDefinida);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  }

  private actualizarPosicionRemotaChofer(coords: PuntoRuta): void {
    if (!this.L) return;

    if (!this.marcadorChofer) {
      this.marcadorChofer = this.L.marker([coords.lat, coords.lng])
        .bindPopup(this.rol === 'usuario' ? '<b>El transporte viene aquí</b>' : '<b>Unidad en ruta</b>')
        .addTo(this.mapa);
    } else {
      this.marcadorChofer.setLatLng([coords.lat, coords.lng]);
    }

    this.mapa.panTo([coords.lat, coords.lng]);
  }

  ngOnDestroy(): void {
    if (this.seguimientoGPS !== null && isPlatformBrowser(this.platformId)) {
      navigator.geolocation.clearWatch(this.seguimientoGPS);
    }
    if (this.mapa) {
      this.mapa.remove();
    }
  }
}