export const proveedoresConfig = {
    title: 'Proveedores',
    subtitle: 'Gestiona los proveedores registrados',
    apiEndpoint: '/proveedores',
    idKey: 'id_proveedor',

    kpis: [
        {
            title: 'Total proveedores',
            valueKey: 'total',
            subtitle: 'Proveedores registrados',
            icon: 'business'
        }
    ],

    tableColumns: [
        {
            key: 'id_proveedor',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_usuario',
            label: 'Usuario',
            type: 'number'
        },
        {
            key: 'nombre_negocio',
            label: 'Nombre del negocio',
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
            key: 'id_usuario',
            label: 'ID Usuario',
            type: 'number',
            required: true
        },
        {
            key: 'nombre_negocio',
            label: 'Nombre del negocio',
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
            type: 'text',
            required: true
        }
    ],

    formFieldsEdit: [
        {
            key: 'id_usuario',
            label: 'ID Usuario',
            type: 'number',
            required: true
        },
        {
            key: 'nombre_negocio',
            label: 'Nombre del negocio',
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
            type: 'text',
            required: true
        }
    ]
};