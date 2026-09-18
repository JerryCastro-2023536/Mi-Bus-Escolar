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
];