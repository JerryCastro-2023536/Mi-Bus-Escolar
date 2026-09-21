export const ubicacionesBusConfig = {
    title: 'Ubicaciones del Bus',
    subtitle: 'Gestiona las ubicaciones registradas de los buses',
    apiEndpoint: '/ubicaciones-bus',
    idKey: 'id_ubicacion',

    kpis: [
        {
            title: 'Total ubicaciones',
            valueKey: 'total',
            subtitle: 'Ubicaciones registradas',
            icon: 'location_on'
        }
    ],

    tableColumns: [
        {
            key: 'id_ubicacion',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_viaje',
            label: 'Viaje',
            type: 'number'
        },
        {
            key: 'latitud',
            label: 'Latitud',
            type: 'number'
        },
        {
            key: 'longitud',
            label: 'Longitud',
            type: 'number'
        },
        {
            key: 'velocidad',
            label: 'Velocidad',
            type: 'number'
        },
        {
            key: 'fecha_hora',
            label: 'Fecha y hora',
            type: 'date'
        }
    ],

    formFields: [
        {
            key: 'id_viaje',
            label: 'ID Viaje',
            type: 'number',
            required: true
        },
        {
            key: 'latitud',
            label: 'Latitud',
            type: 'number',
            required: true
        },
        {
            key: 'longitud',
            label: 'Longitud',
            type: 'number',
            required: true
        },
        {
            key: 'velocidad',
            label: 'Velocidad',
            type: 'number'
        }
    ],

    formFieldsEdit: [
        {
            key: 'id_viaje',
            label: 'ID Viaje',
            type: 'number',
            required: true
        },
        {
            key: 'latitud',
            label: 'Latitud',
            type: 'number',
            required: true
        },
        {
            key: 'longitud',
            label: 'Longitud',
            type: 'number',
            required: true
        },
        {
            key: 'velocidad',
            label: 'Velocidad',
            type: 'number'
        }
    ]
};
