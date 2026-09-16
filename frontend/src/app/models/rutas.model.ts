export const rutasConfig = {
    title: 'Rutas',
    subtitle: 'Gestiona las rutas del servicio de transporte',
    apiEndpoint: '/rutas',
    idKey: 'id_ruta',

    kpis: [
        {
            title: 'Total rutas',
            valueKey: 'total',
            subtitle: 'Rutas registradas',
            icon: 'route'
        },
        {
            title: 'Rutas activas',
            valueKey: 'activas',
            subtitle: 'Rutas disponibles',
            icon: 'check_circle'
        }
    ],

    tableColumns: [
        {
            key: 'id_ruta',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_servicio',
            label: 'Servicio',
            type: 'number'
        },
        {
            key: 'id_vehiculo',
            label: 'Vehículo',
            type: 'number'
        },
        {
            key: 'id_chofer',
            label: 'Chofer',
            type: 'number'
        },
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text'
        },
        {
            key: 'hora_inicio_estimada',
            label: 'Hora inicio',
            type: 'text'
        },
        {
            key: 'hora_fin_estimada',
            label: 'Hora fin',
            type: 'text'
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'badge'
        }
    ],

    formFields: [
        {
            key: 'id_servicio',
            label: 'ID Servicio',
            type: 'number',
            required: true
        },
        {
            key: 'id_vehiculo',
            label: 'ID Vehículo',
            type: 'number'
        },
        {
            key: 'id_chofer',
            label: 'ID Chofer',
            type: 'number'
        },
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text',
            required: true
        },
        {
            key: 'hora_inicio_estimada',
            label: 'Hora de inicio',
            type: 'text'
        },
        {
            key: 'hora_fin_estimada',
            label: 'Hora de finalización',
            type: 'text'
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'select',
            required: true,
            options: [
                {
                    value: 'ACTIVO',
                    label: 'Activo'
                },
                {
                    value: 'INACTIVO',
                    label: 'Inactivo'
                }
            ]
        }
    ],

    formFieldsEdit: [
        {
            key: 'id_servicio',
            label: 'ID Servicio',
            type: 'number',
            required: true
        },
        {
            key: 'id_vehiculo',
            label: 'ID Vehículo',
            type: 'number'
        },
        {
            key: 'id_chofer',
            label: 'ID Chofer',
            type: 'number'
        },
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text',
            required: true
        },
        {
            key: 'hora_inicio_estimada',
            label: 'Hora de inicio',
            type: 'text'
        },
        {
            key: 'hora_fin_estimada',
            label: 'Hora de finalización',
            type: 'text'
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'select',
            required: true,
            options: [
                {
                    value: 'ACTIVO',
                    label: 'Activo'
                },
                {
                    value: 'INACTIVO',
                    label: 'Inactivo'
                }
            ]
        }
    ]
};