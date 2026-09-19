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
import { notificacionesConfig } from '../models/notificaciones.model';
import { roleGuard } from '../core/guards/role.guard';

const loadCrudView = () =>
    import('./../components/crud-view/crud-view').then(m => m.CrudViewComponent);

export const crudRoutes: Routes = [
    { path: 'usuarios', component: CrudViewComponent, canActivate: [roleGuard], data: { config: usuariosConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'choferes', component: CrudViewComponent, canActivate: [roleGuard], data: { config: choferesConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'asistencias', component: CrudViewComponent, canActivate: [roleGuard], data: { config: asistenciasConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'colegios', component: CrudViewComponent, canActivate: [roleGuard], data: { config: colegiosConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'estudiantes', component: CrudViewComponent, canActivate: [roleGuard], data: { config: estudiantesConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'incidencias', component: CrudViewComponent, canActivate: [roleGuard], data: { config: incidenciasConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'paradas', component: CrudViewComponent, canActivate: [roleGuard], data: { config: paradasConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'rutas', component: CrudViewComponent, canActivate: [roleGuard], data: { config: rutasConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'valoraciones', component: CrudViewComponent, canActivate: [roleGuard], data: { config: valoracionesConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'vehiculos', component: CrudViewComponent, canActivate: [roleGuard], data: { config: vehiculosConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'proveedores', component: CrudViewComponent, canActivate: [roleGuard], data: { config: proveedoresConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'servicios', component: CrudViewComponent, canActivate: [roleGuard], data: { config: serviciosConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'ruta-parada', component: CrudViewComponent, canActivate: [roleGuard], data: { config: rutaParadaConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'asignaciones-ruta', component: CrudViewComponent, canActivate: [roleGuard], data: { config: asignacionesRutaConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'viajes', component: CrudViewComponent, canActivate: [roleGuard], data: { config: viajesConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'ubicaciones-bus', component: CrudViewComponent, canActivate: [roleGuard], data: { config: ubicacionesBusConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'pagos', component: CrudViewComponent, canActivate: [roleGuard], data: { config: pagosConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } },
    { path: 'notificacionesCrud', component: CrudViewComponent, canActivate: [roleGuard], data: { config: notificacionesConfig, hideHeader: true, roles: ['ADMINISTRADOR'] } }
];