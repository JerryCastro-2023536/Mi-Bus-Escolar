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

    if (
      this.mapa &&
      changes['rutaDefinida'] &&
      this.rutaDefinida &&
      this.rutaDefinida.length > 0
    ) {
      this.trazarRuta(this.rutaDefinida);
    }

    if (
      this.mapa &&
      changes['posicionChofer'] &&
      this.posicionChofer
    ) {
      if (this.rol === 'usuario' || this.rol === 'proveedor') {
        this.actualizarPosicionRemotaChofer(this.posicionChofer);
      }
    }

    if (
      this.mapa &&
      changes['puntoSeleccionado'] &&
      this.puntoSeleccionado
    ) {
      this.actualizarMarcadorPunto(this.puntoSeleccionado);
    }
  }

  private inicializarMapa(): void {

    /*
     * Leaflet y Leaflet Routing Machine se cargan desde angular.json
     * como scripts globales.
     *
     * Por eso aquí usamos window.L en lugar de import('leaflet').
     */
    this.L = (window as any).L;

    if (!this.L) {
      console.error(
        'Leaflet no está disponible. Revisa angular.json.'
      );
      return;
    }

    if (!this.L.Routing) {
      console.error(
        'Leaflet Routing Machine no está disponible. Revisa angular.json.'
      );
      return;
    }

    /*
     * Evita intentar inicializar dos veces el mismo mapa.
     */
    if (this.mapa) {
      return;
    }

    const centroInicial: [number, number] =
      this.posicionChofer
        ? [
            Number(this.posicionChofer.lat),
            Number(this.posicionChofer.lng)
          ]
        : this.puntoSeleccionado
          ? [
              Number(this.puntoSeleccionado.lat),
              Number(this.puntoSeleccionado.lng)
            ]
          : this.rutaDefinida.length > 0
            ? [
                Number(this.rutaDefinida[0].lat),
                Number(this.rutaDefinida[0].lng)
              ]
            : [
                14.6349,
                -90.5069
              ];

    this.mapa = this.L
      .map('mapa')
      .setView(
        centroInicial,
        14
      );

    this.L
      .tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }
      )
      .addTo(this.mapa);

    /*
     * Icono Leaflet.
     */
    const defaultIcon = this.L.icon({
      iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

      shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });

    this.L.Marker.prototype.options.icon = defaultIcon;

    /*
     * Angular puede terminar de calcular el tamaño del contenedor
     * después de que Leaflet se inicializa.
     */
    requestAnimationFrame(() => {
      this.mapa?.invalidateSize();
    });

    setTimeout(() => {
      this.mapa?.invalidateSize();
    }, 300);

    /*
     * Mostrar posición del chofer para usuario/proveedor.
     */
    if (
      this.posicionChofer &&
      (
        this.rol === 'usuario' ||
        this.rol === 'proveedor'
      )
    ) {
      this.actualizarPosicionRemotaChofer(
        this.posicionChofer
      );
    }

    /*
     * Dibujar ruta inicial.
     */
    if (
      this.rutaDefinida &&
      this.rutaDefinida.length > 0
    ) {
      this.trazarRuta(
        this.rutaDefinida
      );
    }

    /*
     * Chofer:
     * activar GPS.
     */
    if (this.rol === 'chofer') {

      this.iniciarGpsChofer();

    } else if (
      this.debePermitirSeleccionPunto()
    ) {

      const puntoInicial: PuntoRuta =
        this.puntoSeleccionado ?? {
          lat: centroInicial[0],
          lng: centroInicial[1]
        };

      this.actualizarMarcadorPunto(
        puntoInicial
      );

      this.cambioUbicacion.emit(
        puntoInicial
      );

      this.habilitarSeleccionPunto();
    }
  }

  private debePermitirSeleccionPunto(): boolean {

    if (
      this.rol !== 'admin' &&
      this.rol !== 'usuario'
    ) {
      return false;
    }

    return !(
      this.posicionChofer &&
      this.posicionChofer.lat !== undefined &&
      this.posicionChofer.lng !== undefined
    );
  }

  private crearIconoBus(): any {

    return this.L.divIcon({

      html: `
        <div style="
          background: linear-gradient(135deg, #10b981, #059669);
          color: #ffffff;

          width: 38px;
          height: 38px;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          box-shadow:
            0 0 15px rgba(16, 185, 129, 0.8),
            0 3px 6px rgba(0,0,0,0.3);

          border: 2.5px solid #ffffff;

          font-size: 16px;
        ">
          <i class="fa-solid fa-bus"></i>
        </div>
      `,

      className: 'bus-marker-custom',

      iconSize: [
        38,
        38
      ],

      iconAnchor: [
        19,
        19
      ],

      popupAnchor: [
        0,
        -22
      ]
    });
  }

  private habilitarSeleccionPunto(): void {

    this.mapa.on(
      'click',
      (e: any) => {

        const nuevaCoordenada: PuntoRuta = {
          lat: e.latlng.lat,
          lng: e.latlng.lng
        };

        this.actualizarMarcadorPunto(
          nuevaCoordenada
        );

        this.cambioUbicacion.emit(
          nuevaCoordenada
        );
      }
    );
  }

  private actualizarMarcadorPunto(
    punto: PuntoRuta
  ): void {

    if (
      !this.L ||
      !this.mapa
    ) {
      return;
    }

    const esEditable =
      this.debePermitirSeleccionPunto();

    const iconoPersonalizado =
      this.L.icon({

        iconUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

        shadowUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

        iconSize: [
          25,
          41
        ],

        iconAnchor: [
          12,
          41
        ],

        popupAnchor: [
          1,
          -34
        ]
      });

    if (!this.marcadorPunto) {

      this.marcadorPunto =
        this.L.marker(
          [
            Number(punto.lat),
            Number(punto.lng)
          ],
          {
            icon: iconoPersonalizado,
            draggable: esEditable
          }
        )
        .addTo(
          this.mapa
        );

      if (esEditable) {

        this.marcadorPunto.on(
          'dragend',
          () => {

            const position =
              this.marcadorPunto.getLatLng();

            const nuevaCoordenada: PuntoRuta = {
              lat: position.lat,
              lng: position.lng
            };

            this.cambioUbicacion.emit(
              nuevaCoordenada
            );
          }
        );
      }

    } else {

      this.marcadorPunto.setLatLng(
        [
          Number(punto.lat),
          Number(punto.lng)
        ]
      );
    }

    this.mapa.panTo(
      [
        Number(punto.lat),
        Number(punto.lng)
      ]
    );
  }

  private trazarRuta(
    puntos: PuntoRuta[]
  ): void {

    if (
      !this.L ||
      !this.mapa
    ) {
      return;
    }

    if (
      !puntos ||
      puntos.length === 0
    ) {

      if (this.controlRuta) {

        this.mapa.removeControl(
          this.controlRuta
        );

        this.controlRuta = null;
      }

      return;
    }

    let waypoints =
      puntos.map(
        punto =>
          this.L.latLng(
            Number(punto.lat),
            Number(punto.lng)
          )
      );

    let choferLatLng: any = null;

    if (
      this.posicionChofer &&
      this.posicionChofer.lat !== undefined &&
      this.posicionChofer.lng !== undefined
    ) {

      choferLatLng =
        this.L.latLng(
          Number(this.posicionChofer.lat),
          Number(this.posicionChofer.lng)
        );

    } else if (
      this.marcadorChofer
    ) {

      choferLatLng =
        this.marcadorChofer.getLatLng();
    }

    if (
      choferLatLng &&
      (
        this.rol === 'chofer' ||
        this.rol === 'proveedor' ||
        this.rol === 'usuario'
      )
    ) {

      waypoints.unshift(
        choferLatLng
      );
    }

    if (
      waypoints.length < 2
    ) {

      if (this.controlRuta) {

        this.mapa.removeControl(
          this.controlRuta
        );

        this.controlRuta = null;
      }

      return;
    }

    /*
     * Si ya existe el control:
     * actualizamos los puntos.
     */
    if (this.controlRuta) {

      this.controlRuta.setWaypoints(
        waypoints
      );

      return;
    }

    /*
     * Leaflet Routing Machine ahora vive en window.L.Routing.
     */
    this.controlRuta =
      this.L.Routing.control({

        waypoints,

        lineOptions: {
          styles: [
            {
              color: '#2563eb',
              weight: 6,
              opacity: 0.85
            }
          ]
        },

        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,

        show: false,

        createMarker: (
          i: number,
          wp: any,
          n: number
        ) => {

          /*
           * Si el primer punto es el chofer,
           * no dibujamos marcador normal porque
           * ya tiene el icono del bus.
           */
          if (
            i === 0 &&
            choferLatLng &&
            (
              this.rol === 'chofer' ||
              this.rol === 'proveedor' ||
              this.rol === 'usuario'
            )
          ) {

            return null;
          }

          return this.L.marker(
            wp.latLng,
            {
              icon: this.L.icon({

                iconUrl:
                  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

                shadowUrl:
                  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

                iconSize: [
                  25,
                  41
                ],

                iconAnchor: [
                  12,
                  41
                ]
              })
            }
          );
        }
      })
      .addTo(
        this.mapa
      );
  }

  private iniciarGpsChofer(): void {

    if (
      !('geolocation' in navigator)
    ) {
      return;
    }

    const iconoBus =
      this.crearIconoBus();

    this.seguimientoGPS =
      navigator.geolocation.watchPosition(

        posicion => {

          const lat =
            Number(
              posicion.coords.latitude
            );

          const lng =
            Number(
              posicion.coords.longitude
            );

          const puntoGps: PuntoRuta = {
            lat,
            lng
          };

          if (!this.marcadorChofer) {

            this.marcadorChofer =
              this.L.marker(
                [
                  lat,
                  lng
                ],
                {
                  icon: iconoBus
                }
              )
              .bindPopup(
                '<b>Tu ubicación (Chofer)</b>'
              )
              .addTo(
                this.mapa
              );

          } else {

            this.marcadorChofer.setIcon(
              iconoBus
            );

            this.marcadorChofer.setLatLng(
              [
                lat,
                lng
              ]
            );
          }

          if (
            this.controlRuta &&
            this.rutaDefinida &&
            this.rutaDefinida.length > 0
          ) {

            const waypoints = [

              this.L.latLng(
                lat,
                lng
              ),

              ...this.rutaDefinida.map(
                punto =>
                  this.L.latLng(
                    Number(punto.lat),
                    Number(punto.lng)
                  )
              )
            ];

            this.controlRuta.setWaypoints(
              waypoints
            );

          } else if (
            !this.controlRuta &&
            this.rutaDefinida &&
            this.rutaDefinida.length > 0
          ) {

            this.trazarRuta(
              this.rutaDefinida
            );
          }

          this.cambioUbicacion.emit(
            puntoGps
          );
        },

        error => {

          console.warn(
            'GPS Chofer:',
            error?.message
          );
        },

        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 15000
        }
      );
  }

  private actualizarPosicionRemotaChofer(
    coords: PuntoRuta
  ): void {

    if (
      !this.L ||
      !this.mapa
    ) {
      return;
    }

    const lat =
      Number(
        coords.lat
      );

    const lng =
      Number(
        coords.lng
      );

    const choferLatLng =
      this.L.latLng(
        lat,
        lng
      );

    const iconoBus =
      this.crearIconoBus();

    if (!this.marcadorChofer) {

      this.marcadorChofer =
        this.L.marker(
          [
            lat,
            lng
          ],
          {
            icon: iconoBus
          }
        )
        .bindPopup(
          this.rol === 'usuario'
            ? '<b>El transporte viene aquí</b>'
            : '<b>Ubicación actual del autobús</b>'
        )
        .addTo(
          this.mapa
        );

    } else {

      this.marcadorChofer.setIcon(
        iconoBus
      );

      this.marcadorChofer.setLatLng(
        [
          lat,
          lng
        ]
      );
    }

    if (
      this.controlRuta &&
      this.rutaDefinida &&
      this.rutaDefinida.length > 0
    ) {

      const waypoints = [

        choferLatLng,

        ...this.rutaDefinida.map(
          punto =>
            this.L.latLng(
              Number(punto.lat),
              Number(punto.lng)
            )
        )
      ];

      this.controlRuta.setWaypoints(
        waypoints
      );

    } else if (
      !this.controlRuta &&
      this.rutaDefinida &&
      this.rutaDefinida.length > 0
    ) {

      this.trazarRuta(
        this.rutaDefinida
      );
    }

    this.mapa.panTo(
      [
        lat,
        lng
      ]
    );
  }

  ngOnDestroy(): void {

    if (
      this.seguimientoGPS !== null &&
      isPlatformBrowser(
        this.platformId
      )
    ) {

      navigator.geolocation.clearWatch(
        this.seguimientoGPS
      );

      this.seguimientoGPS = null;
    }

    if (this.controlRuta && this.mapa) {

      try {
        this.mapa.removeControl(
          this.controlRuta
        );
      } catch {
        // Ya pudo haber sido eliminado.
      }

      this.controlRuta = null;
    }

    if (this.mapa) {

      this.mapa.remove();

      this.mapa = null;
    }

    this.marcadorChofer = null;
    this.marcadorPunto = null;
  }
}