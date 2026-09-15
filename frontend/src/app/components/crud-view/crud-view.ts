import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { CrudService } from '../../services/crud.service';
import { CrudConfig, FormField } from '../../models/crudDTO.interface';
import { ApiResponse } from '../../models/apiResponseDTO.interface';

import { HeaderComponent } from './header/header';
import { TableComponent } from './table/table';
import { CardComponent } from './card/card';
import { FormComponent } from './form/form';
import Swal from 'sweetalert2';
import { toastSuccess, toastError, extractMessage } from '../../helpers/swal-toast';

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

  formFields = computed<FormField[]>(() => {
    const cfg = this.config();
    if (!cfg) return [];

    const item = this.formItem();
    const editing = item !== null && item !== undefined;

    const base = editing ? (cfg.formFieldsEdit ?? cfg.formFields) : cfg.formFields;

    return base.map(f => ({
      ...f,
      readonly: !!(
        f.readonly ||                        // solo lectura en ambos modos
        (editing && f.readonlyOnEdit) ||      // solo lectura al editar
        (!editing && f.readonlyOnCreate)      // solo lectura al crear
      ),
    }));
  });

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
    effect(() => {
      const cfg = this.config();
      if (cfg) this.loadData(cfg);
    });
  }

  loadData(cfg: CrudConfig) {
    this.loading.set(true);

    this.crudService.getAll<any>(cfg.apiEndpoint).subscribe({
      next: (res: ApiResponse<any[]>) => {
        this.items.set(res.data ?? []);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        toastError(extractMessage(err, 'No se pudieron cargar los registros'));
      }
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
        next: (res: ApiResponse<void>) => {
          this.items.update(list => list.filter(i => i !== item));
          this.selectedItem.set(null);
          toastSuccess(res.message ?? 'Registro eliminado');
        },
        error: (err: HttpErrorResponse) => {
          toastError(extractMessage(err, 'No se pudo eliminar el registro. Intenta de nuevo.'));
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
        next: (res: ApiResponse<any>) => {
          this.items.update(list => list.map(i => (i === editing ? { ...i, ...res.data } : i)));
          this.formItem.set(undefined);
          toastSuccess(res.message ?? 'Registro actualizado');
        },
        error: (err: HttpErrorResponse) => this.handleBackendErrors(err, 'No se pudo actualizar el registro')
      });
    } else {
      this.crudService.create<any>(cfg.apiEndpoint, formData).subscribe({
        next: (res: ApiResponse<any>) => {
          this.items.update(list => [...list, res.data]);
          this.formItem.set(undefined);
          toastSuccess(res.message ?? 'Registro creado');
        },
        error: (err: HttpErrorResponse) => this.handleBackendErrors(err, 'No se pudo guardar el registro')
      });
    }
  }

  private handleBackendErrors(err: HttpErrorResponse, fallbackToast = 'Ocurrió un error') {
    if (err.error && Array.isArray(err.error.errors)) {
      const errorMap: Record<string, string> = {};
      err.error.errors.forEach((e: { campo: string; mensaje: string }) => {
        errorMap[e.campo] = e.mensaje;
      });
      this.serverErrors.set(errorMap);
    } else {
      this.serverErrors.set({});
      toastError(extractMessage(err, fallbackToast));
    }
  }
}
