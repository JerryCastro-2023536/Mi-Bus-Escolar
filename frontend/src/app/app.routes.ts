import { Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa.component';
import { ChoferDashboardComponents } from './components/chofer-dashboard/chofer-dashboard.components';

export const routes: Routes = [
    {
        path: "mapa", 
        component: MapaComponent
    },
    {
        path: "dashboard-chofer",
        component: ChoferDashboardComponents
    }
];
