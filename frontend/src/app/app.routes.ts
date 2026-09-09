import { usuariosConfig } from './models/usuarios.model';
import { Routes } from '@angular/router';
import { CrudViewComponent } from './components/crud-view/crud-view';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { choferesCrudConfig } from './models/choferes.model';
import { asistenciasConfig } from './models/asistencias.model';
import { colegiosConfig } from './models/colegios.model';
import { estudiantesConfig } from './models/estudiantes.model';
import { incidenciasConfig } from './models/incidencias.model';
import { paradasConfig } from './models/pardas.model';
import { rutasConfig } from './models/rutas.model';
import { valoracionesConfig } from './models/valoraciones.model';
import { vehiculosConfig } from './models/vehiculos.model';

export const routes: Routes = [
    {
        path: 'usuarios',
        component: CrudViewComponent,
        data: { config: usuariosConfig }
    },
    {
        path: 'choferes',
        component: CrudViewComponent,
        data: { config: choferesCrudConfig }
    },
    {
        path: 'asistencias',
        component: CrudViewComponent,
        data: { config: asistenciasConfig }
    },
    {
        path: 'colegios',
        component: CrudViewComponent,
        data: { config: colegiosConfig }
    },
    {
        path: 'estudiantes',
        component: CrudViewComponent,
        data: { config: estudiantesConfig }
    },
    {
        path: 'incidencias',
        component: CrudViewComponent,
        data: { config: incidenciasConfig }
    },
    {
        path: 'paradas',
        component: CrudViewComponent,
        data: { config: paradasConfig }
    },
    {
        path: 'rutas',
        component: CrudViewComponent,
        data: { config: rutasConfig }
    },
    {
        path: 'valoraciones',
        component: CrudViewComponent,
        data: { config: valoracionesConfig }
    },
    {
        path: 'vehiculos',
        component: CrudViewComponent,
        data: { config: vehiculosConfig }
    },
    { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
];