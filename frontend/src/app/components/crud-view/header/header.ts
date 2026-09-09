import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KpiConfig } from '../../../models/crudDTO.interface';


@Component({
  selector: 'app-crud-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  title = input.required<string>();
  subtitle = input<string>('');
  kpis = input<KpiConfig[]>([]);

  /** Diccionario con los valores reales de los KPIs (EN DESARROLLO) */
  kpiData = input<Record<string, number | string>>({});

  search = output<string>();
  create = output<void>();

  searchTerm = '';

  onSearchChange() {
    this.search.emit(this.searchTerm);
  }

  onCreateClick() {
    this.create.emit();
  }
}