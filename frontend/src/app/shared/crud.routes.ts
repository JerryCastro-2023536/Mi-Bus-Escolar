import { usuariosConfig } from './../models/usuarios.model';
import { choferesConfig } from './../models/choferes.model';
import { asistenciasConfig } from './../models/asistencias.model';
import { colegiosConfig } from './../models/colegios.model';
import { estudiantesConfig } from './../models/estudiantes.model';
import { incidenciasConfig } from './../models/incidencias.model';
import { paradasConfig } from './../models/pardas.model';
import { rutasConfig } from './../models/rutas.model';
import { valoracionesConfig } from './../models/valoraciones.model';
import { vehiculosConfig } from './../models/vehiculos.model';
import { proveedoresConfig } from '../models/proveedores.model';
import { serviciosConfig } from '../models/servicios.model';
import { rutaParadaConfig } from '../models/rutaParada.model';
import { asignacionesRutaConfig } from '../models/Asignaciones_Rutas.model';
import { viajesConfig } from '../models/viajes.model';
import { ubicacionesBusConfig } from '../models/ubicacionesBus.model';
import { pagosConfig } from '../models/pago.model';
import { Routes } from '@angular/router';
import { CrudViewComponent } from './../components/crud-view/crud-view';

const loadCrudView = () =>
    import('./../components/crud-view/crud-view').then(m => m.CrudViewComponent);

export const crudRoutes: Routes = [
    { path: 'usuarios', component: CrudViewComponent, data: { config: usuariosConfig, hideHeader: true } },
    { path: 'choferes', component: CrudViewComponent, data: { config: choferesConfig, hideHeader: true } },
    { path: 'asistencias', component: CrudViewComponent, data: { config: asistenciasConfig, hideHeader: true } },
    { path: 'colegios', component: CrudViewComponent, data: { config: colegiosConfig, hideHeader: true } },
    { path: 'estudiantes', component: CrudViewComponent, data: { config: estudiantesConfig, hideHeader: true } },
    { path: 'incidencias', component: CrudViewComponent, data: { config: incidenciasConfig, hideHeader: true } },
    { path: 'paradas', component: CrudViewComponent, data: { config: paradasConfig, hideHeader: true } },
    { path: 'rutas', component: CrudViewComponent, data: { config: rutasConfig, hideHeader: true } },
    { path: 'valoraciones', component: CrudViewComponent, data: { config: valoracionesConfig, hideHeader: true } },
    { path: 'vehiculos', component: CrudViewComponent, data: { config: vehiculosConfig, hideHeader: true } },
    { path: 'proveedores', component: CrudViewComponent, data: { config: proveedoresConfig, hideHeader: true } },
    { path: 'servicios', component: CrudViewComponent, data: { config: serviciosConfig, hideHeader: true } },
    { path: 'ruta-parada', component: CrudViewComponent, data: { config: rutaParadaConfig, hideHeader: true } },
    { path: 'asignaciones-ruta', component: CrudViewComponent, data: { config: asignacionesRutaConfig, hideHeader: true } },
    { path: 'viajes', component: CrudViewComponent, data: { config: viajesConfig, hideHeader: true } },
    { path: 'ubicaciones-bus', component: CrudViewComponent, data: { config: ubicacionesBusConfig, hideHeader: true } },
    { path: 'pagos', component: CrudViewComponent, data: { config: pagosConfig, hideHeader: true } },
];