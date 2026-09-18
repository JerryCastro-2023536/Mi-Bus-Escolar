export const paradasConfig = {
    title: 'Paradas',
    subtitle: 'Gestiona las paradas de las rutas',
    apiEndpoint: '/paradas',
    idKey: 'id_parada',

    kpis: [
        {
            title: 'Total paradas',
            valueKey: 'total',
            subtitle: 'Paradas registradas',
            icon: 'location_on'
        }
    ],

    tableColumns: [
        {
            key: 'id_parada',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text'
        },
        {
            key: 'direccion',
            label: 'Dirección',
            type: 'text'
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
        }
    ],

    formFields: [
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text',
            required: true
        },
        {
            key: 'direccion',
            label: 'Dirección',
            type: 'text',
            required: true
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
        }
    ],

    formFieldsEdit: [
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text',
            required: true
        },
        {
            key: 'direccion',
            label: 'Dirección',
            type: 'text',
            required: true
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
        }
    ]
};