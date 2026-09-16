export const viajesConfig = {
    title: 'Viajes',
    subtitle: 'Gestiona los viajes realizados por los vehículos',
    apiEndpoint: '/viajes',
    idKey: 'id_viaje',

    kpis: [
        {
            title: 'Total viajes',
            valueKey: 'total',
            subtitle: 'Viajes registrados',
            icon: 'directions_bus'
        },
        {
            title: 'Viajes activos',
            valueKey: 'activos',
            subtitle: 'Viajes en curso',
            icon: 'play_circle'
        }
    ],

    tableColumns: [
        { key: 'id_viaje', label: 'ID', type: 'number' },
        { key: 'id_ruta', label: 'Ruta', type: 'number' },
        { key: 'id_chofer', label: 'Chofer', type: 'number' },
        { key: 'id_vehiculo', label: 'Vehículo', type: 'number' },
        { key: 'fecha_viaje', label: 'Fecha del viaje', type: 'date' },
        { key: 'hora_inicio', label: 'Hora de inicio', type: 'date' },
        { key: 'hora_fin', label: 'Hora de finalización', type: 'date' },
        { key: 'estado', label: 'Estado', type: 'badge' }
    ],

    formFields: [
        {
            key: 'id_ruta',
            label: 'ID Ruta',
            type: 'number'
        },
        {
            key: 'id_chofer',
            label: 'ID Chofer',
            type: 'number'
        },
        {
            key: 'id_vehiculo',
            label: 'ID Vehículo',
            type: 'number'
        },
        {
            key: 'fecha_viaje',
            label: 'Fecha del viaje',
            type: 'date',
            required: true
        },
        {
            key: 'hora_inicio',
            label: 'Hora de inicio',
            type: 'date'
        },
        {
            key: 'hora_fin',
            label: 'Hora de finalización',
            type: 'date'
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'select',
            required: true,
            options: [
                { value: 'PENDIENTE', label: 'Pendiente' },
                { value: 'EN_CURSO', label: 'En curso' },
                { value: 'FINALIZADO', label: 'Finalizado' },
                { value: 'CANCELADO', label: 'Cancelado' }
            ]
        }
    ],

    formFieldsEdit: [
        {
            key: 'id_ruta',
            label: 'ID Ruta',
            type: 'number'
        },
        {
            key: 'id_chofer',
            label: 'ID Chofer',
            type: 'number'
        },
        {
            key: 'id_vehiculo',
            label: 'ID Vehículo',
            type: 'number'
        },
        {
            key: 'fecha_viaje',
            label: 'Fecha del viaje',
            type: 'date',
            required: true
        },
        {
            key: 'hora_inicio',
            label: 'Hora de inicio',
            type: 'date'
        },
        {
            key: 'hora_fin',
            label: 'Hora de finalización',
            type: 'date'
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'select',
            required: true,
            options: [
                { value: 'PENDIENTE', label: 'Pendiente' },
                { value: 'EN_CURSO', label: 'En curso' },
                { value: 'FINALIZADO', label: 'Finalizado' },
                { value: 'CANCELADO', label: 'Cancelado' }
            ]
        }
    ]
};