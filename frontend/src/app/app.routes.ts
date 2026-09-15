import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { DashboardComponent } from './components/dashboard-layout/dashboard-layout';
import { AdminView } from './components/admin-view/admin-view';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard] },

  { path: 'admin-view', component: AdminView, canActivate: [authGuard] },
  { path: 'admin', component: AdminView, canActivate: [authGuard] },

  { path: 'dashboard', component: AdminView, canActivate: [authGuard] },
  { path: 'dashboard-layout', component: DashboardComponent, canActivate: [authGuard] },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: '**', redirectTo: 'login' }
];
