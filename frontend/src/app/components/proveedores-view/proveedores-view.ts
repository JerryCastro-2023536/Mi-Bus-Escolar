import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export type ProveedorCategoryId = 'Servicio' | 'Pagos' | 'Rutas' | 'Reportes';
export type CategoryFilter = 'ALL' | ProveedorCategoryId;

export type CardTheme = 'sky' | 'emerald' | 'amber' | 'violet';

export interface ProveedorModule {
  label: string;
  description: string;
  icon: string;
  route: string;
  keywords?: string;
}

export interface ProveedorSection {
  id: ProveedorCategoryId;
  title: string;
  subtitle: string;
  theme: CardTheme;
  items: ProveedorModule[];
}

export interface CategoryTab {
  id: CategoryFilter;
  label: string;
}

/** Quita tildes y pasa a minúsculas para que "operacion" encuentre "Operación". */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

@Component({
  selector: 'app-proveedores-view',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './proveedores-view.html',
  styleUrl: './proveedores-view.css'
})
export class ProveedoresView {

  readonly searchQuery = signal('');
  readonly selectedCategory = signal<CategoryFilter>('ALL');

  private readonly sections: ProveedorSection[] = [
    {
      id: 'Servicio',
      title: 'Mi servicio',
      subtitle: 'Registra tu servicio de bus y administra lo que lo hace funcionar.',
      theme: 'sky',
      items: [
        {
          label: 'Servicios',
          description: 'Registra y edita los planes de transporte que ofreces, con sus tarifas, para conseguir pasajeros.',
          icon: 'box',
          route: '/mis-servicios',
          keywords: 'registrar publicar oferta paquetes tarifas pasajeros'
        },
        {
          label: 'Vehículos',
          description: 'Buses y microbuses de tu flota, con placa, modelo y capacidad.',
          icon: 'bus',
          route: '/mis-vehiculos',
          keywords: 'flota buses placa capacidad'
        },
        {
          label: 'Choferes',
          description: 'Conductores a tu cargo, sus licencias y datos de contacto.',
          icon: 'id-card',
          route: '/mis-choferes',
          keywords: 'conductores pilotos licencia'
        }
      ]
    },
    {
      id: 'Pagos',
      title: 'Pagos',
      subtitle: 'Revisa comprobantes y ve quién está al día y quién debe.',
      theme: 'emerald',
      items: [
        {
          label: 'Pagos',
          description: 'Comprobantes de pago del servicio de bus y estado de cada cuenta.',
          icon: 'credit-card',
          route: '/pagos-proveedor',
          keywords: 'comprobantes boleta deposito transferencia recibo mora deuda pendiente al dia'
        }
      ]
    },
    {
      id: 'Rutas',
      title: 'Rutas',
      subtitle: 'Controla por dónde pasa cada bus y quién lo conduce.',
      theme: 'amber',
      items: [
        {
          label: 'Rutas',
          description: 'Trazados de trayectos matutinos y vespertinos que operas.',
          icon: 'route',
          route: '/mis-rutas',
          keywords: 'recorridos horario zonas'
        },
        {
          label: 'Asignación de Ruta',
          description: 'Qué chofer, vehículo y colegio cubren cada ruta.',
          icon: 'link',
          route: '/asignacion-ruta-proveedor',
          keywords: 'asignar chofer vehiculo colegio'
        }
      ]
    },
    {
      id: 'Reportes',
      title: 'Reportes del camino',
      subtitle: 'Lo que ocurre en el trayecto, con registro para reportarlo.',
      theme: 'violet',
      items: [
        {
          label: 'Incidencias',
          description: 'Reportes de tráfico, averías mecánicas o emergencias ocurridas en el camino.',
          icon: 'triangle-exclamation',
          route: '/mis-incidencias',
          keywords: 'reportes accidente falla retraso problema emergencia'
        },
        {
          label: 'Viajes',
          description: 'Viajes en curso y registro histórico con fecha, ruta y estado.',
          icon: 'map',
          route: '/mis-viajes',
          keywords: 'historial recorridos despacho'
        },
        {
          label: 'Valoraciones',
          description: 'Calificaciones y comentarios de los padres sobre tu servicio.',
          icon: 'star',
          route: '/mis-valoraciones',
          keywords: 'calificaciones opiniones reseñas'
        }
      ]
    }
  ];

  readonly categoryTabs: CategoryTab[] = [
    { id: 'Servicio', label: 'Mi servicio' },
    { id: 'Pagos', label: 'Pagos' },
    { id: 'Rutas', label: 'Rutas' },
    { id: 'Reportes', label: 'Reportes' }
  ];

  readonly totalEntitiesCount = this.sections.reduce((sum, s) => sum + s.items.length, 0);

  /** Secciones visibles según la categoría elegida y el texto de búsqueda. */
  readonly filteredSections = computed<ProveedorSection[]>(() => {
    const query = normalize(this.searchQuery());
    const category = this.selectedCategory();

    return this.sections
      .filter(section => category === 'ALL' || section.id === category)
      .map(section => ({
        ...section,
        items: query
          ? section.items.filter(item =>
              normalize(`${item.label} ${item.description} ${item.keywords ?? ''} ${section.title}`).includes(query)
            )
          : section.items
      }))
      .filter(section => section.items.length > 0);
  });

  setCategory(category: CategoryFilter): void {
    this.selectedCategory.set(category);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  resetFilters(): void {
    this.clearSearch();
    this.setCategory('ALL');
  }
}