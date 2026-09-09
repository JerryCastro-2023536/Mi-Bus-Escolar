import { usuariosConfig } from './models/usuarios.model';
import { Routes } from '@angular/router';
import { CrudViewComponent } from './components/crud-view/crud-view';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { choferesCrudConfig } from './models/choferes.model';

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
    { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
];