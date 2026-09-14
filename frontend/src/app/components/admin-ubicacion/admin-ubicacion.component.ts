import { Component } from '@angular/core';
import { MapaComponent } from '../mapa/mapa.component'; // Ajusta la ruta de tu componente
import { PuntoRuta } from '../../models/mapas.type';

@Component({
  selector: 'app-admin-ubicacion',
  standalone: true,
  imports: [MapaComponent],
  templateUrl: './admin-ubicacion.component.html',
  styleUrl: './admin-ubicacion.component.css'
})
export class AdminUbicacionComponent {
  // Coordenada por defecto inicial
  coordenadaActual: PuntoRuta = {
    lat: 14.6349,
    lng: -90.5069
  };

  // Escucha los cambios del marcador o clics en el mapa
  onUbicacionCambiada(nuevaCoordenada: PuntoRuta): void {
    this.coordenadaActual = nuevaCoordenada;
    console.log('Coordenada capturada:', this.coordenadaActual);
  }

  guardarCoordenada(): void {
    console.log('Enviando a base de datos:', this.coordenadaActual);
    alert(`Ubicación guardada:\nLatitud: ${this.coordenadaActual.lat}\nLongitud: ${this.coordenadaActual.lng}`);
    // Aquí ejecutas la petición a tu Backend:
    // this.miServicio.guardarPunto(this.coordenadaActual).subscribe(...);
  }
}