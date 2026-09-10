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
  idKey = input.required<string>()

  // --- Salidas ---
  rowClick = output<any>();

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

  getValue(row: any, column: TableColumn) {
    return row[column.key];
  }

  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  getBadgeColor(value: string): { bg: string; text: string } {
    const normalized = String(value ?? '').trim().toUpperCase();

    const semantic: Record<string, string> = {
      ACTIVO: '#16A34A',
      ACTIVE: '#16A34A',
      PENDIENTE: '#D97706',
      PENDING: '#D97706',
      SUSPENDIDO: '#DC2626',
      INACTIVO: '#DC2626',
      INACTIVE: '#DC2626'
    };

    const color = semantic[normalized] ?? this.hashBrandColor(normalized);
    return { bg: color + '1a', text: color };
  }

  private hashBrandColor(value: string): string {
    const palette = ['#1A456B', '#5D737E', '#B08900', '#0F766E', '#7C3AED', '#0891B2'];
    if (!value) return palette[0];
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
  }
}
