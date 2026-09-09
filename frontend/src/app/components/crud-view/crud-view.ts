import { Component, inject, input, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CrudService } from '../../services/crud.service';
import { CrudConfig } from '../../models/crudDTO.interface';

import { HeaderComponent } from './header/header';
import { TableComponent } from './table/table';
import { CardComponent } from './card/card';
import { FormComponent } from './form/form';

@Component({
  selector: 'app-crud-view',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TableComponent, CardComponent, FormComponent],
  templateUrl: './crud-view.html',
  styleUrl: './crud-view.css'
})
export class CrudViewComponent {
  private route = inject(ActivatedRoute);
  private crudService = inject(CrudService);

  //Archivo config de la ruta
  config = computed<CrudConfig>(() => this.route.snapshot.data['config'] as CrudConfig);

  //Tabla
  items = signal<any[]>([]);
  loading = signal(false);
  kpiData = signal<Record<string, number | string>>({});
  searchTerm = signal('');

  selectedItem = signal<any | null>(null); //Card
  formItem = signal<any | null | undefined>(undefined); // undefined = form cerrado, null = modo crear, objeto = modo editar

  //Busqueda general
  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.items();

    return this.items().filter(item =>
      this.config().tableColumns.some(col =>
        String(item[col.key] ?? '').toLowerCase().includes(term)
      )
    );
  });

  constructor() {
    // Cargar los datos de la entidad cuando el config este listo
    effect(() => {
      const cfg = this.config();
      if (cfg) this.loadData(cfg);
    });
  }

  loadData(cfg: CrudConfig) {
    this.loading.set(true);

    this.crudService.getAll<any>(cfg.apiEndpoint).subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  // --- Eventos del header ---
  onSearch(term: string) {
    this.searchTerm.set(term);
  }

  onCreate() {
    this.formItem.set(null);
  }

  // --- Eventos de la tabla ---
  onRowClick(item: any) {
    this.selectedItem.set(item);
  }

  // --- Eventos de la tarjeta de detalle ---
  onCloseCard() {
    this.selectedItem.set(null);
  }

  onEditFromCard(item: any) {
    this.selectedItem.set(null);
    this.formItem.set(item); 
  }

  onDeleteFromCard(item: any) {
    const cfg = this.config();
    const id = item.id_usuario ?? item.id;

    if (!confirm('¿Seguro que quieres eliminar este registro?')) return;

    this.crudService.delete(cfg.apiEndpoint, id).subscribe({
      next: () => {
        this.items.update(list => list.filter(i => i !== item));
        this.selectedItem.set(null);
      }
    });
  }

  // --- Eventos del formulario ---
  onCancelForm() {
    this.formItem.set(undefined);
  }

  onSaveForm(formData: any) {
    const cfg = this.config();
    const editing = this.formItem();

    if (editing) {
      const id = editing.id; //REVISAR
      this.crudService.update<any>(cfg.apiEndpoint, id, formData).subscribe({
        next: (updated) => {
          this.items.update(list => list.map(i => (i === editing ? { ...i, ...updated } : i)));
          this.formItem.set(undefined);
        }
      });
    } else {
      this.crudService.create<any>(cfg.apiEndpoint, formData).subscribe({
        next: (created) => {
          this.items.update(list => [...list, created]);
          this.formItem.set(undefined);
        }
      });
    }
  }
}