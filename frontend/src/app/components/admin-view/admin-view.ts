import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { miBusEscolarSidebarConfig } from '../../config/sidebar-nav.config';
import { SidebarSection } from '../../models/sidebar.model';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './admin-view.html',
  styleUrl: './admin-view.css'
})
export class AdminView {
  sections: SidebarSection[] = miBusEscolarSidebarConfig;

  searchQuery = '';
  selectedCategory = 'ALL';

  setCategory(categoria: string): void {
    this.selectedCategory = categoria;
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  getCardTheme(categoria: string = ''): string {
    const nombre = this.normalizar(categoria);
    if (nombre.includes('identidad')) return 'card-sky';
    if (nombre.includes('flota')) return 'card-emerald';
    if (nombre.includes('operac')) return 'card-amber';
    return 'card-violet';
  }

  get totalEntitiesCount(): number {
    return this.sections
      .filter(s => s.title)
      .reduce((total, s) => total + s.items.length, 0);
  }

  get filteredSections(): SidebarSection[] {
    const busqueda = this.normalizar(this.searchQuery.trim());
    const categoria = this.normalizar(this.selectedCategory);
    const resultado: SidebarSection[] = [];

    for (const seccion of this.sections) {
      if (!seccion.title) continue;

      const titulo = this.normalizar(seccion.title);
      const coincideCategoria = categoria === 'all' || titulo.includes(categoria);
      if (!coincideCategoria) continue;

      const itemsFiltrados = seccion.items.filter(item => {
        if (!busqueda) return true;
        return this.normalizar(item.label).includes(busqueda)
            || this.normalizar(item.description ?? '').includes(busqueda);
      });

      if (itemsFiltrados.length > 0) {
        resultado.push({ title: seccion.title, items: itemsFiltrados });
      }
    }

    return resultado;
  }

  private normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
}