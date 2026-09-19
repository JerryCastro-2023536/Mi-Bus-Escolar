import { SidebarBrand, SidebarSection } from '../models/sidebar.model';

export const miBusEscolarBrand: SidebarBrand = {
    name: 'Mi Bus Escolar',
    tagline: 'Transporte Seguro',
    icon: 'bus'
};

export type AppRole = 'ADMINISTRADOR' | 'PROVEEDOR' | 'CHOFER' | 'USUARIO';

export function normalizeRole(role?: string | null): AppRole {
    const r = (role || '').toUpperCase();
    if (r === 'ADMIN' || r === 'ADMINISTRADOR') return 'ADMINISTRADOR';
    if (r === 'PROVEEDOR' || r === 'CHOFER' || r === 'USUARIO') return r as AppRole;
    return 'USUARIO';
}

export const DASHBOARD_ROUTE_BY_ROLE: Record<AppRole, string> = {
    ADMINISTRADOR: '/dashboard/admin',
    PROVEEDOR: '/dashboard/proveedor',
    CHOFER: '/dashboard/chofer',
    USUARIO: '/dashboard/usuario',
};

export function getDashboardRoute(role?: string | null): string {
    return DASHBOARD_ROUTE_BY_ROLE[normalizeRole(role)];
}

const adminSidebar: SidebarSection[] = [
    { items: [{ label: 'Dashboard', icon: 'gauge', route: '/dashboard/admin', exact: true, description: 'Resumen general y panel de control' }] },
    {
        title: 'Identidad',
        items: [
            { label: 'Usuarios', icon: 'users', route: '/usuarios', description: 'Cuentas de acceso, contraseñas y asignación de roles' },
            { label: 'Estudiantes', icon: 'graduation-cap', route: '/estudiantes', description: 'Padrón de alumnos, tutores y colegios asignados' },
            { label: 'Choferes', icon: 'id-card', route: '/choferes', description: 'Conductores certificados, licencias y datos de contacto' },
            { label: 'Colegios', icon: 'school', route: '/colegios', description: 'Sedes escolares afiliadas, convenios y horarios' }
        ]
    },
    {
        title: 'Flota',
        items: [
            { label: 'Vehículos', icon: 'bus', route: '/vehiculos', description: 'Buses y microbuses, placas, modelo y capacidad' },
            { label: 'Proveedores', icon: 'building', route: '/proveedores', description: 'Empresas de transporte escolar y autorizaciones' },
            { label: 'Servicios', icon: 'box', route: '/servicios', description: 'Planes de transporte escolar, paquetes y tarifas' }
        ]
    },
    {
        title: 'Operación',
        items: [
            { label: 'Rutas', icon: 'route', route: '/rutas', description: 'Trazados de trayectos matutinos, vespertinos y zonas' },
            { label: 'Paradas', icon: 'location-dot', route: '/paradas', description: 'Puntos seguros de abordaje y geolocalización' },
            { label: 'Ruta - Parada', icon: 'road', route: '/ruta-parada', description: 'Secuencia ordenada de paradas y tiempos estimados' },
            { label: 'Asignación de Ruta', icon: 'link', route: '/asignaciones-ruta', description: 'Vinculación de chofer, vehículo, colegio y ruta' },
            { label: 'Viajes', icon: 'map', route: '/viajes', description: 'Despacho, viajes en curso y registros históricos' },
            { label: 'Ubicaciones del Bus', icon: 'location-arrow', route: '/ubicaciones-bus', description: 'Telemetría GPS en tiempo real de las unidades' },
            { label: 'Asistencias', icon: 'clipboard-check', route: '/asistencias', description: 'Registro de abordaje y descenso de alumnos' }
        ]
    },
    {
        title: 'Comunicación',
        items: [
            { label: 'Notificaciones', icon: 'bell', route: '/notificacionesCrud', description: 'Avisos y alertas automáticas a padres de familia' },
            { label: 'Incidencias', icon: 'triangle-exclamation', route: '/incidencias', description: 'Reportes de tráfico, averías mecánicas o emergencias' },
            { label: 'Valoraciones', icon: 'star', route: '/valoraciones', description: 'Calificaciones de calidad y comentarios del servicio' }
        ]
    },
    { title: 'Pagos', items: [{ label: 'Pagos', icon: 'credit-card', route: '/pagos', description: 'Control de cuotas mensuales, recibos y estados de cuenta' }] }
];

const proveedorSidebar: SidebarSection[] = [
    { items: [{ label: 'Dashboard', icon: 'gauge', route: '/dashboard/proveedor', exact: true, description: 'Resumen general y panel de control' }] },
    {
        title: 'Mi Flotilla',
        items: [
            { label: 'Vehículos', icon: 'bus', route: '/vehiculos', description: 'Buses y microbuses, placas, modelo y capacidad' },
            { label: 'Choferes', icon: 'id-card', route: '/choferes', description: 'Conductores certificados, licencias y datos de contacto' }
        ]
    },
    {
        title: 'Afiliaciones',
        items: [
            { label: 'Colegios', icon: 'school', route: '/colegios', description: 'Sedes escolares afiliadas, convenios y horarios' },
            { label: 'Servicios', icon: 'box', route: '/servicios', description: 'Planes de transporte escolar, paquetes y tarifas' }
        ]
    },
    {
        title: 'Operación',
        items: [
            { label: 'Rutas', icon: 'route', route: '/rutas', description: 'Trazados de trayectos matutinos, vespertinos y zonas' },
            { label: 'Asignación de Ruta', icon: 'link', route: '/asignaciones-ruta', description: 'Vinculación de chofer, vehículo, colegio y ruta' },
            { label: 'Viajes', icon: 'map', route: '/viajes', description: 'Despacho, viajes en curso y registros históricos' }
        ]
    },
    { title: 'Facturación', items: [{ label: 'Pagos', icon: 'credit-card', route: '/pagos', description: 'Control de cuotas mensuales, recibos y estados de cuenta' }] }
];

const choferSidebar: SidebarSection[] = [
    { items: [{ label: 'Dashboard', icon: 'gauge', route: '/dashboard/chofer', exact: true, description: 'Resumen de tu jornada' }] },
    {
        title: 'Mi Operación',
        items: [
            { label: 'Mis Rutas', icon: 'route', route: '/rutas', description: 'Trayectos asignados' },
            { label: 'Viajes', icon: 'map', route: '/viajes', description: 'Viajes en curso e historial' },
            { label: 'Ubicación en Vivo', icon: 'location-arrow', route: '/ubicaciones-bus', description: 'Transmisión GPS de tu unidad' },
            { label: 'Asistencias', icon: 'clipboard-check', route: '/asistencias', description: 'Registro de abordaje y descenso de alumnos' }
        ]
    },
    {
        title: 'Comunicación',
        items: [
            { label: 'Incidencias', icon: 'triangle-exclamation', route: '/incidencias', description: 'Reportar averías, tráfico o emergencias' },
            { label: 'Notificaciones', icon: 'bell', route: '/notificaciones', description: 'Avisos del sistema' }
        ]
    }
];

const usuarioSidebar: SidebarSection[] = [
    { items: [{ label: 'Dashboard', icon: 'gauge', route: '/dashboard/usuario', exact: true, description: 'Resumen de tu servicio' }] },
    { title: 'Mi Familia', items: [{ label: 'Mis Estudiantes', icon: 'graduation-cap', route: '/estudiantes', description: 'Alumnos registrados a tu cargo' }] },
    { title: 'Seguimiento', items: [{ label: 'Notificaciones', icon: 'bell', route: '/notificaciones', description: 'Alertas de ruta y avisos' }] },
    { title: 'Pagos', items: [{ label: 'Mis Pagos', icon: 'credit-card', route: '/pagosUser', description: 'Consulta y realiza pagos del transporte' }] }
];

const SIDEBAR_CONFIG_BY_ROLE: Record<AppRole, SidebarSection[]> = {
    ADMINISTRADOR: adminSidebar,
    PROVEEDOR: proveedorSidebar,
    CHOFER: choferSidebar,
    USUARIO: usuarioSidebar,
};

export function getSidebarSections(role?: string | null): SidebarSection[] {
    return SIDEBAR_CONFIG_BY_ROLE[normalizeRole(role)];
}