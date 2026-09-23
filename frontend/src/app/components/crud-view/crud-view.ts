import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    TableComponent,
    CardComponent,
    FormComponent
  ],
  templateUrl: './crud-view.html',
  styleUrl: './crud-view.css'
})
export class CrudViewComponent {
  private route = inject(ActivatedRoute);
  private crudService = inject(CrudService);

  // CONFIGURACIÓN

  config = computed<CrudConfig>(
    () => this.route.snapshot.data['config'] as CrudConfig
  );

  serverErrors = signal<Record<string, string>>({});

  // DATOS

  items = signal<any[]>([]);
  loading = signal(false);
  kpiData = signal<Record<string, number | string>>({});
  searchTerm = signal('');

  selectedItem = signal<any | null>(null);

  // undefined = formulario cerrado
  // null = crear
  // objeto = editar
  formItem = signal<any | null | undefined>(undefined);

  // PAGINACIÓN

  pageSizeOptions = [5, 10, 20];
  pageSize = signal(10);
  currentPage = signal(1);

  // RELLENAR FORMULARIO
  formFields = computed<FormField[]>(() => {
    const cfg = this.config();

    if (!cfg) return [];

    const item = this.formItem();
    const editing = item !== null && item !== undefined;

    const base = editing
      ? (cfg.formFieldsEdit ?? cfg.formFields)
      : cfg.formFields;

    return base.map(field => ({
      ...field,
      readonly: !!(
        field.readonly ||
        (editing && field.readonlyOnEdit) ||
        (!editing && field.readonlyOnCreate)
      ),
    }));
  });

  // BÚSQUEDA

  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      return this.items();
    }

    return this.items().filter(item =>
      this.config().tableColumns.some(column =>
        String(item[column.key] ?? '')
          .toLowerCase()
          .includes(term)
      )
    );
  });

  // CÁLCULOS DE PAGINACIÓN

  totalItems = computed(() => this.filteredItems().length);

  totalPages = computed(() => {
    const total = this.totalItems();

    if (total === 0) return 1;

    return Math.ceil(total / this.pageSize());
  });

  paginatedItems = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();

    const start = (page - 1) * size;
    const end = start + size;

    return this.filteredItems().slice(start, end);
  });

  firstVisibleItem = computed(() => {
    if (this.totalItems() === 0) return 0;

    return ((this.currentPage() - 1) * this.pageSize()) + 1;
  });

  lastVisibleItem = computed(() => {
    if (this.totalItems() === 0) return 0;

    return Math.min(
      this.currentPage() * this.pageSize(),
      this.totalItems()
    );
  });

  constructor() {
    effect(() => {
      const cfg = this.config();

      if (cfg) {
        this.loadData(cfg);
        this.loadKpis(cfg);
      }
    });
    effect(() => {
      const total = this.totalPages();
      const page = this.currentPage();

      if (page > total) {
        this.currentPage.set(total);
      }
    });
  }

  // CARGA DE DATOS

  loadData(cfg: CrudConfig) {
    this.loading.set(true);

    this.crudService.getAll<any>(cfg.apiEndpoint).subscribe({
      next: (res: ApiResponse<any[]>) => {
        this.items.set(res.data ?? []);
        this.currentPage.set(1);
        this.loading.set(false);
      },

      error: (err: HttpErrorResponse) => {
        this.loading.set(false);

        toastError(
          extractMessage(
            err,
            'No se pudieron cargar los registros'
          )
        );
      }
    });
  }

  loadKpis(cfg: CrudConfig) {
    if (!cfg.kpis?.length) return;

    this.crudService.getKpis(cfg.apiEndpoint).subscribe({
      next: (
        res: ApiResponse<Record<string, number | string>>
      ) => {
        this.kpiData.set(res.data ?? {});
      },

      error: () => {
        this.kpiData.set({});
      }
    });
  }

  // HEADER
  onSearch(term: string) {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onCreate() {
    this.formItem.set(null);
  }

  // PAGINACIÓN
  onPageSizeChange(value: number | string) {
    const size = Number(value);

    if (!this.pageSizeOptions.includes(size)) {
      return;
    }

    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
  }

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    const start = Math.max(
      1,
      Math.min(current - 2, total - 4)
    );

    const end = Math.min(total, start + 4);

    const pages: number[] = [];

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  });

  // TABLA

  onRowClick(item: any) {
    this.selectedItem.set(item);
  }

  // TARJETA DE DETALLE

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

    }).then(result => {
      if (!result.isConfirmed) return;

      this.crudService
        .delete(cfg.apiEndpoint, id)
        .subscribe({
          next: (res: ApiResponse<void>) => {
            this.items.update(list =>
              list.filter(current => current !== item)
            );

            this.selectedItem.set(null);

            toastSuccess(
              res.message ?? 'Registro eliminado'
            );

            this.loadKpis(cfg);
          },

          error: (err: HttpErrorResponse) => {
            toastError(
              extractMessage(
                err,
                'No se pudo eliminar el registro. Intenta de nuevo.'
              )
            );
          }
        });
    });
  }
  // FORMULARIO

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

      this.crudService
        .update<any>(
          cfg.apiEndpoint,
          id,
          formData
        )
        .subscribe({
          next: (res: ApiResponse<any>) => {
            this.items.update(list =>
              list.map(item =>
                item === editing
                  ? { ...item, ...res.data }
                  : item
              )
            );

            this.formItem.set(undefined);

            toastSuccess(
              res.message ?? 'Registro actualizado'
            );

            this.loadKpis(cfg);
          },

          error: (err: HttpErrorResponse) =>
            this.handleBackendErrors(
              err,
              'No se pudo actualizar el registro'
            )
        });

    } else {

      this.crudService
        .create<any>(
          cfg.apiEndpoint,
          formData
        )
        .subscribe({
          next: (res: ApiResponse<any>) => {
            this.items.update(list => [
              ...list,
              res.data
            ]);

            this.formItem.set(undefined);

            toastSuccess(
              res.message ?? 'Registro creado'
            );

            this.loadKpis(cfg);
          },

          error: (err: HttpErrorResponse) =>
            this.handleBackendErrors(
              err,
              'No se pudo guardar el registro'
            )
        });
    }
  }

  private handleBackendErrors(
    err: HttpErrorResponse,
    fallbackToast = 'Ocurrió un error'
  ) {
    if (
      err.error &&
      Array.isArray(err.error.errors)
    ) {
      const errorMap:
        Record<string, string> = {};

      err.error.errors.forEach(
        (error: {
          campo: string;
          mensaje: string;
        }) => {
          errorMap[error.campo] =
            error.mensaje;
        }
      );

      this.serverErrors.set(errorMap);

    } else {
      this.serverErrors.set({});

      toastError(
        extractMessage(
          err,
          fallbackToast
        )
      );
    }
  }
}
