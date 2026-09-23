import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tiempoRelativo', standalone: true, pure: false })
export class TiempoRelativoPipe implements PipeTransform {
    transform(fecha?: string | Date | null): string {
        if (!fecha) {
            return 'Sin fecha';
        }

        const entonces = new Date(fecha).getTime();
        if (Number.isNaN(entonces)) {
            return 'Sin fecha';
        }

        const ahora = Date.now();
        const diff = Math.floor((ahora - entonces) / 1000);

        if (diff < 60) return 'Hace un momento';
        if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
        if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
        return `Hace ${Math.floor(diff / 86400)} días`;
    }
}
