export const choferesConfig = {
    title: 'Choferes',
    subtitle: 'Gestiona los choferes registrados',
    apiEndpoint: '/choferes',
    idKey: 'id_chofer',

    kpis: [
        {
            title: 'Total choferes',
            valueKey: 'total',
            subtitle: 'Choferes registrados',
            icon: 'person'
        },
        {
            title: 'Choferes activos',
            valueKey: 'activos',
            subtitle: 'Choferes disponibles',
            icon: 'check_circle'
        }
    ],

    tableColumns: [
        {
            key: 'id_chofer',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_usuario',
            label: 'Usuario',
            type: 'number'
        },
        {
            key: 'id_proveedor',
            label: 'Proveedor',
            type: 'number'
        },
        {
            key: 'telefono_contacto',
            label: 'Teléfono',
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
            key: 'id_usuario',
            label: 'ID Usuario',
            type: 'number',
            required: true
        },
        {
            key: 'id_proveedor',
            label: 'ID Proveedor',
            type: 'number',
            required: true
        },
        {
            key: 'telefono_contacto',
            label: 'Teléfono de contacto',
            type: 'text',
            required: true
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
            key: 'id_usuario',
            label: 'ID Usuario',
            type: 'number',
            required: true
        },
        {
            key: 'id_proveedor',
            label: 'ID Proveedor',
            type: 'number',
            required: true
        },
        {
            key: 'telefono_contacto',
            label: 'Teléfono de contacto',
            type: 'text',
            required: true
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