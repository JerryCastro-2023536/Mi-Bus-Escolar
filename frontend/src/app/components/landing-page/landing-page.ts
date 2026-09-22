import {
  Component,
  OnInit
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  forkJoin
} from 'rxjs';


import {
  ServiciosService,
  Servicio,
  Proveedor,
  Ruta
} from '../../services/servicios.service';


import {
  ValoracionesService,
  Valoracion
} from '../../services/valoraciones.service';


/* ========================================
   MODELO PARA LA LANDING
======================================== */

export interface ServicioLanding
  extends Servicio {

  proveedor?: Proveedor;

  rutas: Ruta[];

  valoraciones: Valoracion[];

  promedioValoraciones: number;

}


@Component({

  selector: 'app-landing-page',

  standalone: true,

  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],

  templateUrl: './landing-page.html',

  styleUrl: './landing-page.css'

})
export class LandingPage
  implements OnInit {


  /* ======================================
     DATOS
  ====================================== */

  servicios: Servicio[] = [];

  proveedores: Proveedor[] = [];

  rutas: Ruta[] = [];

  valoraciones: Valoracion[] = [];


  serviciosLanding:
    ServicioLanding[] = [];

  serviciosFiltrados:
    ServicioLanding[] = [];


  /* ======================================
     FILTROS
  ====================================== */

  filtroNombre = '';

  precioMaximo:
    number | null = null;


  /* ======================================
     ESTADO
  ====================================== */

  cargando = true;

  errorCarga = false;


  constructor(

    private serviciosService:
      ServiciosService,

    private valoracionesService:
      ValoracionesService

  ) {}


  ngOnInit(): void {

    this.cargarDatos();

  }


  /* ======================================
     CARGAR INFORMACIÓN
  ====================================== */

  cargarDatos(): void {

    this.cargando = true;

    this.errorCarga = false;


    forkJoin({

      servicios:
        this.serviciosService
          .obtenerServicios(),

      proveedores:
        this.serviciosService
          .obtenerProveedores(),

      rutas:
        this.serviciosService
          .obtenerRutas(),

      valoraciones:
        this.valoracionesService
          .obtenerValoraciones()

    }).subscribe({


      next: ({
        servicios,
        proveedores,
        rutas,
        valoraciones
      }) => {


        this.servicios =
          servicios.data ?? [];


        this.proveedores =
          proveedores.data ?? [];


        this.rutas =
          rutas.data ?? [];


        this.valoraciones =
          valoraciones.data ?? [];


        this.construirServiciosLanding();


        this.cargando = false;

      },


      error: (error) => {

        console.error(
          'Error cargando información de la landing:',
          error
        );

        this.errorCarga = true;

        this.cargando = false;

      }

    });

  }


  /* ======================================
     CONSTRUIR SERVICIOS
  ====================================== */

  construirServiciosLanding(): void {

    this.serviciosLanding =
      this.servicios

        .filter(
          servicio =>
            servicio.estado
              ?.toUpperCase() === 'ACTIVO'
        )

        .map(servicio => {


          /* PROVEEDOR */

          const proveedor =
            this.proveedores.find(

              proveedor =>
                proveedor.id_proveedor ===
                servicio.id_proveedor

            );


          /* RUTAS */

          const rutasServicio =
            this.rutas.filter(

              ruta =>

                ruta.id_servicio ===
                  servicio.id_servicio

                &&

                ruta.estado
                  ?.toUpperCase() ===
                  'ACTIVO'

            );


          /* VALORACIONES */

          const valoracionesProveedor =
            this.valoraciones.filter(

              valoracion =>

                valoracion.id_proveedor ===
                servicio.id_proveedor

            );


          /* PROMEDIO */

          const promedio =
            valoracionesProveedor.length > 0

              ?

              valoracionesProveedor.reduce(

                (
                  total,
                  valoracion
                ) =>

                  total +
                  Number(
                    valoracion.calificacion
                  ),

                0

              ) /
              valoracionesProveedor.length

              :

              0;


          return {

            ...servicio,

            proveedor,

            rutas: rutasServicio,

            valoraciones:
              valoracionesProveedor,

            promedioValoraciones:
              promedio

          };

        });


    this.serviciosFiltrados = [
      ...this.serviciosLanding
    ];

  }


  /* ======================================
     FILTRAR
  ====================================== */

  filtrarServicios(): void {

    const nombre =
      this.filtroNombre
        .trim()
        .toLowerCase();


    this.serviciosFiltrados =
      this.serviciosLanding.filter(
        servicio => {


          const coincideNombre =

            !nombre ||

            servicio.nombre
              .toLowerCase()
              .includes(nombre);


          const coincidePrecio =

            this.precioMaximo === null ||

            this.precioMaximo <= 0 ||

            Number(
              servicio.precio_mensual
            ) <= this.precioMaximo;


          return (
            coincideNombre &&
            coincidePrecio
          );

        }
      );

  }


  /* ======================================
     LIMPIAR FILTROS
  ====================================== */

  limpiarFiltros(): void {

    this.filtroNombre = '';

    this.precioMaximo = null;

    this.serviciosFiltrados = [
      ...this.serviciosLanding
    ];

  }


  /* ======================================
     ESTRELLAS
  ====================================== */

  obtenerEstrellas(
    calificacion: number
  ): number[] {

    const cantidad =
      Math.max(
        0,
        Math.min(
          5,
          Math.round(calificacion)
        )
      );


    return Array(
      cantidad
    ).fill(0);

  }

}