export const colegiosConfig = {
    title: 'Colegios',
    subtitle: 'Gestiona los colegios registrados',
    apiEndpoint: '/colegios',
    idKey: 'id_colegio',

    kpis: [
        {
            title: 'Total colegios',
            valueKey: 'total',
            subtitle: 'Colegios registrados',
            icon: 'school'
        }
    ],

    tableColumns: [
        {
            key: 'id_colegio',
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
            key: 'telefono_contacto',
            label: 'Teléfono',
            type: 'text'
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
            type: 'text'
        },
        {
            key: 'telefono_contacto',
            label: 'Teléfono de contacto',
            type: 'text'
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
            type: 'text'
        },
        {
            key: 'telefono_contacto',
            label: 'Teléfono de contacto',
            type: 'text'
        }
    ]
};