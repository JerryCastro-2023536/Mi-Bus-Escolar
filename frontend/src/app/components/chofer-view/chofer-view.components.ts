import { Component } from '@angular/core';
import { MapaComponent } from '../mapa/mapa.component';
import { PuntoRuta } from '../../models/mapas.type';

@Component({
  standalone: true,
  imports: [MapaComponent],
  template: `
    <!-- En la vista del admin -->
    <app-mapa 
      [rol]="'proveedor'" 
      [puntoSeleccionado]="coordenadaGuardada"
      (cambioUbicacion)="onCoordenadaSeleccionada($event)">
    </app-mapa>

    <button (click)="guardarEnBaseDatos()">Guardar Punto en Backend</button>
  `
})
export class ChoferViewComponents {
  coordenadaGuardada?: PuntoRuta;

  onCoordenadaSeleccionada(coords: PuntoRuta): void {
    this.coordenadaGuardada = coords;
    console.log('Coordenada lista para enviar a la BD:', coords);
  }

  guardarEnBaseDatos(): void {
    if (this.coordenadaGuardada) {
      console.log("aguardada")
    }
  }
  /*
  rutaRutaAsignada: PuntoRuta[] = [
    { lat: 14.611056, lng: -90.531631 },
    { lat: 14.596243, lng: -90.555828 }
  ];

  // Acepta 'any' o 'PuntoRuta' para compatibilidad con la vista
  enviarUbicacionAlServidor(coordenadas: PuntoRuta | any) {
    console.log('Enviando nueva posición del chofer al backend:', coordenadas);
  }
    */
}