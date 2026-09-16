export const serviciosConfig = {
    title: 'Servicios',
    subtitle: 'Gestiona los servicios de transporte disponibles',
    apiEndpoint: '/servicios',
    idKey: 'id_servicio',

    kpis: [
        {
            title: 'Total servicios',
            valueKey: 'total',
            subtitle: 'Servicios registrados',
            icon: 'directions_bus'
        },
        {
            title: 'Servicios activos',
            valueKey: 'activos',
            subtitle: 'Servicios disponibles',
            icon: 'check_circle'
        }
    ],

    tableColumns: [
        {
            key: 'id_servicio',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_proveedor',
            label: 'Proveedor',
            type: 'number'
        },
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text'
        },
        {
            key: 'descripcion',
            label: 'Descripción',
            type: 'text'
        },
        {
            key: 'precio_mensual',
            label: 'Precio mensual',
            type: 'number'
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'badge'
        },
        {
            key: 'fecha_creacion',
            label: 'Fecha de creación',
            type: 'date'
        }
    ],

    formFields: [
        {
            key: 'id_proveedor',
            label: 'ID Proveedor',
            type: 'number',
            required: true
        },
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text',
            required: true
        },
        {
            key: 'descripcion',
            label: 'Descripción',
            type: 'text',
            required: true
        },
        {
            key: 'precio_mensual',
            label: 'Precio mensual',
            type: 'number',
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
        },
        {
            key: 'fecha_creacion',
            label: 'Fecha de creación',
            type: 'date',
            required: true
        }
    ],

    formFieldsEdit: [
        {
            key: 'id_proveedor',
            label: 'ID Proveedor',
            type: 'number',
            required: true
        },
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text',
            required: true
        },
        {
            key: 'descripcion',
            label: 'Descripción',
            type: 'text',
            required: true
        },
        {
            key: 'precio_mensual',
            label: 'Precio mensual',
            type: 'number',
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
        },
        {
            key: 'fecha_creacion',
            label: 'Fecha de creación',
            type: 'date',
            required: true
        }
    ]
};