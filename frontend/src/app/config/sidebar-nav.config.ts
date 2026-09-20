import { SidebarBrand, SidebarSection } from '../models/sidebar.model';

export const miBusEscolarBrand: SidebarBrand = {
    name: 'Mi Bus Escolar',
    tagline: 'Panel administrativo',
    icon: 'bus'
};

export const miBusEscolarSidebarConfig: SidebarSection[] = [
    {
        items: [
            { label: 'Dashboard', icon: 'gauge', route: '/dashboard', exact: true, description: 'Resumen general y panel de control' }
        ]
    },
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
    {
        title: 'Pagos',
        items: [
            { label: 'Pagos', icon: 'credit-card', route: '/pagos', description: 'Control de cuotas mensuales, recibos y estados de cuenta' }
        ]
    }
];
