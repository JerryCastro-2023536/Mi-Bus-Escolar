import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntoRuta } from '../../models/mapas.type';
import { MapaComponent } from '../mapa/mapa.component';

@Component({
  imports: [CommonModule, MapaComponent],
  selector: 'app-chofer-dashboard.components',
  styleUrl: './chofer-dashboard.components.css',
  templateUrl: './chofer-dashboard.components.html',
})
export class ChoferDashboardComponents {
  students = signal([
    { id: 1, initials: 'MG', name: 'Mateo Gómez', grade: '5to Primaria - Par...', status: 'Presente' },
    { id: 2, initials: 'SR', name: 'Sofia Ramírez', grade: '3ro Primaria - Par...', status: 'Presente' },
    { id: 3, initials: 'LH', name: 'Lucas Herrera', grade: '6to Primaria - Par...', status: 'Ausente' },
    { id: 4, initials: 'VC', name: 'Valentina Castro', grade: '2do Secundaria - ...', status: 'Presente' },
    { id: 5, initials: 'DM', name: 'Diego Morales', grade: '1ro Secundaria - ...', status: 'Presente' }
  ]);

  // Contadores reactivos basados en el signal
  totalAssigned = computed(() => this.students().length);
  totalPresent = computed(() => this.students().filter(s => s.status === 'Presente').length);
  totalAbsent = computed(() => this.students().filter(s => s.status === 'Ausente').length);

  toggleAttendance(id: number) {
    this.students.update(list => list.map(student => 
      student.id === id 
        ? { ...student, status: student.status === 'Presente' ? 'Ausente' : 'Presente' }
        : student
    ));
  }



  rutaRutaAsignada: PuntoRuta[] = [
    { lat: 14.611056, lng: -90.531631 },
    { lat: 14.596243, lng: -90.555828 }
  ];

  // Acepta 'any' o 'PuntoRuta' para compatibilidad con la vista
  enviarUbicacionAlServidor(coordenadas: PuntoRuta | any) {
    console.log('Enviando nueva posición del chofer al backend:', coordenadas);
  }
  
}
