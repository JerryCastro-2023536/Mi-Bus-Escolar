import { Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa.component';
import { ChoferViewComponents } from './components/chofer-view/chofer-view.components';
import { AdminUbicacionComponent } from './components/admin-ubicacion/admin-ubicacion.component';
import { ChoferDashboardComponents } from './components/chofer-dashboard/chofer-dashboard.components';

export const routes: Routes = [
    {
        path: "mapa", 
        component: MapaComponent
    },
    {
        path: "chofer",
        component: AdminUbicacionComponent
    },
    {
        path: "dashboard-chofer",
        component: ChoferDashboardComponents
    }
];
