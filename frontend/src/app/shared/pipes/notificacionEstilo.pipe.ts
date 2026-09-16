import { Pipe, PipeTransform } from '@angular/core';

export interface NotificacionEstilo {
    icon: string;
    color: string;
    bg: string;
}

const ESTILOS: Record<string, NotificacionEstilo> = {
    INCIDENTE:    { icon: 'triangle-exclamation', color: '#EF4444', bg: '#FEE2E2' },
    ASISTENCIA:   { icon: 'circle-check',          color: '#10B981', bg: '#D1FAE5' },
    INASISTENCIA: { icon: 'circle-xmark',           color: '#F59E0B', bg: '#FEF3C7' },
    OTRO:         { icon: 'bell',                    color: '#1A456B', bg: '#E0F2FE' }
};

@Pipe({ name: 'notificacionEstilo', standalone: true })
export class NotificacionEstiloPipe implements PipeTransform {
    transform(tipo: string): NotificacionEstilo {
        return ESTILOS[tipo] ?? ESTILOS['OTRO'];
    }
}
