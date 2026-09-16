import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';
import { LoginService } from '../../services/login';
import { miBusEscolarBrand, miBusEscolarSidebarConfig } from '../../config/sidebar-nav.config';
import { SidebarSection } from '../../models/sidebar.model';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './admin-view.html',
  styleUrl: './admin-view.css'
})
export class AdminView {
  private loginService = inject(LoginService);
  private router = inject(Router);

  brand = miBusEscolarBrand;
  sections: SidebarSection[] = miBusEscolarSidebarConfig;

  searchQuery: string = '';
  selectedCategory: string = 'ALL';

  get sidebarUser() {
    const usuario = this.loginService.getUser();
    if (usuario) {
      return {
        name: usuario.nombre ?? usuario.name ?? 'Administrador',
        role: usuario.rol ?? 'ADMINISTRADOR'
      };
    }
    return null;
  }

  onLogout(): void {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }

  setCategory(categoria: string): void {
    this.selectedCategory = categoria;
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  getCardTheme(categoria: string = ''): string {
    const nombre = categoria.toLowerCase();
    
    if (nombre.includes('identidad')) {
      return 'card-sky';
    } else if (nombre.includes('flota')) {
      return 'card-emerald';
    } else if (nombre.includes('operac')) {
      return 'card-amber';
    } else {
      return 'card-violet';
    }
  }

  get totalEntitiesCount(): number {
    let total = 0;
    for (const seccion of this.sections) {
      if (seccion.title) {
        total += seccion.items.length;
      }
    }
    return total;
  }

  get filteredSections(): SidebarSection[] {
    const busqueda = this.searchQuery.trim().toLowerCase();
    const categoria = this.selectedCategory.toLowerCase();
    const resultado: SidebarSection[] = [];

    for (const seccion of this.sections) {
      if (!seccion.title) continue;

      const tituloSeccion = seccion.title.toLowerCase();
      const coincideCategoria = categoria === 'all' || tituloSeccion.includes(categoria);

      if (!coincideCategoria) continue;

      const itemsFiltrados = seccion.items.filter(item => {
        if (!busqueda) return true;
        const nombre = item.label.toLowerCase();
        const descripcion = (item.description || '').toLowerCase();
        return nombre.includes(busqueda) || descripcion.includes(busqueda);
      });

      if (itemsFiltrados.length > 0) {
        resultado.push({
          title: seccion.title,
          items: itemsFiltrados
        });
      }
    }

    return resultado;
  }
}
