import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../../models/crudDTO.interface';


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

  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }
}