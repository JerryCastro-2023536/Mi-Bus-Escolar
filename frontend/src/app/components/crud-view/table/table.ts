import { TableColumn } from './../../../models/crudDTO.interface';
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crud-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class TableComponent {
  // --- Entradas ---
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();

  // --- Salidas ---
  rowClick = output<any>();

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

  getValue(row: any, column: TableColumn) {
    return row[column.key];
  }

  getBadgeColor(value: string): string {
    const palette = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0891B2'];
    if (!value) return palette[0];
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
  }
}