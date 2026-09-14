import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntoRuta } from '../../models/mapas.type';
import { MapaComponent } from '../mapa/mapa.component';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  imports: [CommonModule, MapaComponent, ReactiveFormsModule],
  selector: 'app-chofer-dashboard.components',
  styleUrl: './chofer-dashboard.components.css',
  templateUrl: './chofer-dashboard.components.html',
})
export class ChoferDashboardComponents {


  rutaRutaAsignada: PuntoRuta[] = [
    { lat: 14.611056, lng: -90.531631 },
    { lat: 14.596243, lng: -90.555828 }
  ];

  // Acepta 'any' o 'PuntoRuta' para compatibilidad con la vista
  enviarUbicacionAlServidor(coordenadas: PuntoRuta | any) {
    console.log('Enviando nueva posición del chofer al backend:', coordenadas);
  }


  mostrarModalReporte = false;

  reporteForm: FormGroup;

  constructor(
    private fb: FormBuilder

  ) {

    this.reporteForm = this.fb.group({

      titulo: [
        '',
        [
          Validators.required,
          Validators.maxLength(40)
        ]
      ],

      descripcion: [
        ''
      ]

    });

  }


  abrirModalReporte(): void {
    this.mostrarModalReporte = true;
  }


  cerrarModalReporte(): void {
    this.mostrarModalReporte = false;

    this.reporteForm.reset();
  }


  crearReporte(): void {

    if (this.reporteForm.invalid) {
      this.reporteForm.markAllAsTouched();
      return;
    }

    const reporte = this.reporteForm.value;

    console.log('Reporte:', reporte);

    this.cerrarModalReporte();
  }
  
}
