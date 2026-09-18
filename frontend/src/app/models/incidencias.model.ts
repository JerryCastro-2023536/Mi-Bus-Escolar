export const incidenciasConfig = {
    title: 'Incidencias',
    subtitle: 'Gestiona las incidencias reportadas durante los viajes',
    apiEndpoint: '/incidencias',
    idKey: 'id_incidencia',

    kpis: [
        {
            title: 'Total incidencias',
            valueKey: 'total',
            subtitle: 'Incidencias registradas',
            icon: 'warning'
        },
        {
            title: 'Abiertas',
            valueKey: 'abiertas',
            subtitle: 'Incidencias pendientes',
            icon: 'error'
        }
    ],

    tableColumns: [
        {
            key: 'id_incidencia',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_viaje',
            label: 'Viaje',
            type: 'number'
        },
        {
            key: 'id_ruta',
            label: 'Ruta',
            type: 'number'
        },
        {
            key: 'id_usuario_reporta',
            label: 'Usuario',
            type: 'number'
        },
        {
            key: 'titulo',
            label: 'Título',
            type: 'text'
        },
        {
            key: 'descripcion',
            label: 'Descripción',
            type: 'text'
        },
        {
            key: 'fecha_hora',
            label: 'Fecha',
            type: 'date'
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'badge'
        }
    ],

    formFields: [
        {
            key: 'id_viaje',
            label: 'ID Viaje',
            type: 'number'
        },
        {
            key: 'id_ruta',
            label: 'ID Ruta',
            type: 'number',
            required: true
        },
        {
            key: 'id_usuario_reporta',
            label: 'ID Usuario',
            type: 'number'
        },
        {
            key: 'titulo',
            label: 'Título',
            type: 'text',
            required: true
        },
        {
            key: 'descripcion',
            label: 'Descripción',
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
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                {
                    value: 'ABIERTA',
                    label: 'Abierta'
                },
                {
                    value: 'CERRADA',
                    label: 'Cerrada'
                }
            ]
        }
    ],

    formFieldsEdit: [
        {
            key: 'id_viaje',
            label: 'ID Viaje',
            type: 'number'
        },
        {
            key: 'id_ruta',
            label: 'ID Ruta',
            type: 'number',
            required: true
        },
        {
            key: 'id_usuario_reporta',
            label: 'ID Usuario',
            type: 'number'
        },
        {
            key: 'titulo',
            label: 'Título',
            type: 'text',
            required: true
        },
        {
            key: 'descripcion',
            label: 'Descripción',
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
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                {
                    value: 'ABIERTA',
                    label: 'Abierta'
                },
                {
                    value: 'CERRADA',
                    label: 'Cerrada'
                }
            ]
        }
    ]
};