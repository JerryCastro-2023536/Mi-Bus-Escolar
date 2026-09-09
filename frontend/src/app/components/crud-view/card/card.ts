import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../../models/crudDTO.interface';

/**
 * Tarjeta de detalle (modal) que se muestra al hacer click en una fila.
 *
 * Solo pinta la información del registro seleccionado (usando las mismas
 * columnas que la tabla, para no duplicar configuración) y expone dos
 * botones: Editar y Eliminar. No decide qué pasa al editar/eliminar,
 * solo avisa hacia afuera con los eventos `edit` y `delete`.
 */
@Component({
  selector: 'app-crud-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class CardComponent {
  item = input.required<any>();
  columns = input.required<TableColumn[]>();

  close = output<void>();
  edit = output<any>();
  delete = output<any>();

  onClose() {
    this.close.emit();
  }

  onEdit() {
    this.edit.emit(this.item());
  }

  onDelete() {
    this.delete.emit(this.item());
  }

  getValue(column: TableColumn) {
    return this.item()[column.key];
  }
}