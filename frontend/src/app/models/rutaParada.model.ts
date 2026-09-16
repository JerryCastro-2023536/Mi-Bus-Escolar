export const rutaParadaConfig = {
    title: 'Ruta-Paradas',
    subtitle: 'Gestiona las paradas asignadas a las rutas',
    apiEndpoint: '/ruta-parada',
    idKey: 'id_ruta_parada',

    kpis: [
        {
            title: 'Total asignaciones',
            valueKey: 'total',
            subtitle: 'Paradas asignadas a rutas',
            icon: 'route'
        }
    ],

    tableColumns: [
        {
            key: 'id_ruta_parada',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_ruta',
            label: 'Ruta',
            type: 'number'
        },
        {
            key: 'id_parada',
            label: 'Parada',
            type: 'number'
        },
        {
            key: 'orden_parada',
            label: 'Orden',
            type: 'number'
        },
        {
            key: 'minutos_estimados',
            label: 'Minutos estimados',
            type: 'number'
        },
        {
            key: 'hora_estimada',
            label: 'Hora estimada',
            type: 'date'
        }
    ],

    formFields: [
        {
            key: 'id_ruta',
            label: 'ID Ruta',
            type: 'number',
            required: true
        },
        {
            key: 'id_parada',
            label: 'ID Parada',
            type: 'number',
            required: true
        },
        {
            key: 'orden_parada',
            label: 'Orden de parada',
            type: 'number',
            required: true
        },
        {
            key: 'minutos_estimados',
            label: 'Minutos estimados',
            type: 'number'
        },
        {
            key: 'hora_estimada',
            label: 'Hora estimada',
            type: 'date'
        }
    ],

    formFieldsEdit: [
        {
            key: 'id_ruta',
            label: 'ID Ruta',
            type: 'number',
            required: true
        },
        {
            key: 'id_parada',
            label: 'ID Parada',
            type: 'number',
            required: true
        },
        {
            key: 'orden_parada',
            label: 'Orden de parada',
            type: 'number',
            required: true
        },
        {
            key: 'minutos_estimados',
            label: 'Minutos estimados',
            type: 'number'
        },
        {
            key: 'hora_estimada',
            label: 'Hora estimada',
            type: 'date'
        }
    ]
};