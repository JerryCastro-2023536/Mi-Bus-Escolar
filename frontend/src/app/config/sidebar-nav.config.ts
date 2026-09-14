import { SidebarBrand, SidebarSection } from '../models/sidebar.model';

export const miBusEscolarBrand: SidebarBrand = {
    name: 'Mi Bus Escolar',
    tagline: 'Panel administrativo',
    icon: 'bus'
};

export const miBusEscolarSidebarConfig: SidebarSection[] = [
    {
        items: [
            { label: 'Dashboard', icon: 'gauge', route: '/dashboard', exact: true }
        ]
    },
    {
        title: 'Identidad',
        items: [
            { label: 'Usuarios', icon: 'users', route: '/usuarios' },
            { label: 'Estudiantes', icon: 'graduation-cap', route: '/estudiantes' },
            { label: 'Choferes', icon: 'id-card', route: '/choferes' },
            { label: 'Colegios', icon: 'school', route: '/colegios' }
        ]
    },
    {
        title: 'Flota',
        items: [
            { label: 'Vehículos', icon: 'bus', route: '/vehiculos' },
            { label: 'Proveedores', icon: 'building', route: '/proveedores' },
            { label: 'Servicios', icon: 'box', route: '/servicios' }
        ]
    },
    {
        title: 'Operación',
        items: [
            { label: 'Rutas', icon: 'route', route: '/rutas' },
            { label: 'Paradas', icon: 'location-dot', route: '/paradas' },
            { label: 'Ruta - Parada', icon: 'road', route: '/ruta-parada' },
            { label: 'Asignación de Ruta', icon: 'link', route: '/asignaciones-ruta' },
            { label: 'Viajes', icon: 'map', route: '/viajes' },
            { label: 'Ubicaciones del Bus', icon: 'location-arrow', route: '/ubicaciones-bus' },
            { label: 'Asistencias', icon: 'clipboard-check', route: '/asistencias' }
        ]
    },
    {
        title: 'Comunicación',
        items: [
            { label: 'Notificaciones', icon: 'bell', route: '/notificaciones' },
            { label: 'Incidencias', icon: 'triangle-exclamation', route: '/incidencias' },
            { label: 'Valoraciones', icon: 'star', route: '/valoraciones' }
        ]
    },
    {
        title: 'Pagos',
        items: [
            { label: 'Pagos', icon: 'credit-card', route: '/pagos' }
        ]
    }
];
