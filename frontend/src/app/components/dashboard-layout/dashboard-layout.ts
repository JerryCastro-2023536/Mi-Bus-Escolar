import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';
import { LoginService } from '../../services/login';
import { miBusEscolarBrand, miBusEscolarSidebarConfig } from '../../config/sidebar-nav.config';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, SidebarComponent, HeaderComponent],
    templateUrl: './dashboard-layout.html',
    styleUrl: './dashboard-layout.css'
})
export class DashboardComponent {
    private loginService = inject(LoginService);
    private router = inject(Router);

    brand = miBusEscolarBrand;
    sections = miBusEscolarSidebarConfig;

    get sidebarUser() {
        const u = this.loginService.getUser();
        return u ? { name: u.nombre ?? u.name ?? 'Usuario', role: u.rol } : null;
    }

    onLogout(): void {
        this.loginService.logout();
        this.router.navigateByUrl('/login');
    }
}
