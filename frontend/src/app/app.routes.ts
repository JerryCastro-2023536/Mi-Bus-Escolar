import { Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa.component';
import { ChoferDashboardComponents } from './components/mapa-chofer/chofer-dashboard.components';
import { DashboardChoferComponents } from './components/dashboard-chofer/dashboard-chofer.components';

export const routes: Routes = [
    {
        path: "mapa", 
        component: MapaComponent
    },
    {
        path: "ruta-chofer",
        component: ChoferDashboardComponents
    },
    {
        path: "dashboard-chofer",
        component: DashboardChoferComponents
    }
];
