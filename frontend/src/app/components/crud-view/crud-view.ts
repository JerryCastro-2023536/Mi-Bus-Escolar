import { Component, inject, input, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CrudService } from '../../services/crud.service';
import { CrudConfig } from '../../models/crudDTO.interface';

import { HeaderComponent } from './header/header';
import { TableComponent } from './table/table';
import { CardComponent } from './card/card';
import { FormComponent } from './form/form';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

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
  serverErrors = signal<Record<string, string>>({});

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
    const id = item[cfg.idKey];

    Swal.fire({
      title: '¿Estás seguro de eliminar este registro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar de todas formas',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#5D737E', 
      customClass: {
        popup: 'swal-brand-popup',
        title: 'swal-brand-title',
        confirmButton: 'swal-brand-btn',
        cancelButton: 'swal-brand-btn'
      }
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.crudService.delete(cfg.apiEndpoint, id).subscribe({
        next: () => {
          this.items.update(list => list.filter(i => i !== item));
          this.selectedItem.set(null);

          Swal.fire({
            title: '¡Eliminado!',
            text: 'El registro ha sido eliminado.',
            icon: 'success',
            confirmButtonColor: '#1A456B',
            customClass: {
              popup: 'swal-brand-popup',
              title: 'swal-brand-title',
              confirmButton: 'swal-brand-btn'
            }
          });
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el registro. Intenta de nuevo.',
            icon: 'error',
            confirmButtonColor: '#1A456B',
            customClass: {
              popup: 'swal-brand-popup',
              title: 'swal-brand-title',
              confirmButton: 'swal-brand-btn'
            }
          });
        }
      });
    });
  }

  // --- Eventos del formulario ---
  onCancelForm() {
    this.formItem.set(undefined);
    this.serverErrors.set({});
  }

  onSaveForm(formData: any) {
    const cfg = this.config();
    const editing = this.formItem();

    this.serverErrors.set({});

    if (editing) {
      const id = editing[cfg.idKey];
      this.crudService.update<any>(cfg.apiEndpoint, id, formData).subscribe({
        next: (updated) => {
          this.items.update(list => list.map(i => (i === editing ? { ...i, ...updated } : i)));
          this.formItem.set(undefined);
        },
        error: (err: HttpErrorResponse) => this.handleBackendErrors(err)
      });
    } else {
      this.crudService.create<any>(cfg.apiEndpoint, formData).subscribe({
        next: (created) => {
          this.items.update(list => [...list, created]);
          this.formItem.set(undefined);
        },
        error: (err: HttpErrorResponse) => this.handleBackendErrors(err)
      });
    }
  }

  private handleBackendErrors(err: HttpErrorResponse) {
    if (err.error && Array.isArray(err.error.errors)) {
      const errorMap: Record<string, string> = {};
      err.error.errors.forEach((e: { campo: string; mensaje: string }) => {
        errorMap[e.campo] = e.mensaje;
      });
      this.serverErrors.set(errorMap);
    } else if (err.error && err.error.message) {
      alert(err.error.message);
    }
  }
}