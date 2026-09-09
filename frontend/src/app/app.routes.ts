import { usuariosConfig } from './models/usuarios.model';
import { Routes } from '@angular/router';
import { CrudViewComponent } from './components/crud-view/crud-view';
import { authInterceptor } from './core/interceptor/auth.interceptor';

export const routes: Routes = [
    {
        path: 'usuarios',
        component: CrudViewComponent,
        data: { config: usuariosConfig }
    },
    { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
];