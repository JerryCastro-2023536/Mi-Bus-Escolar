import { Component, OnInit, PLATFORM_ID, inject, ChangeDetectorRef, signal, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PuntoRuta } from '../../models/mapas.type';
import { MapaComponent } from '../mapa/mapa.component';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { rutasService } from '../../services/rutas.service';
import { Incidencias } from '../../models/incidencias';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  selector: 'app-dashboard-chofer',
  styleUrl: './dashboard-chofer.components.css',
  templateUrl: './dashboard-chofer.components.html',
})
export class DashboardChoferComponents{
  
}