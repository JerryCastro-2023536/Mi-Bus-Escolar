export const notificacionesConfig = {
    title: 'Notificaciones',
    subtitle: 'Gestiona las notificaciones de los usuarios',
    apiEndpoint: '/notificaciones',
    idKey: 'id_notificaciones',

    kpis: [
        {
            title: 'Total notificaciones',
            valueKey: 'total',
            subtitle: 'Notificaciones registradas',
            icon: 'notifications'
        },
        {
            title: 'No leídas',
            valueKey: 'noLeidas',
            subtitle: 'Notificaciones pendientes',
            icon: 'mark_email_unread'
        },
        {
            title: 'Leídas',
            valueKey: 'leidas',
            subtitle: 'Notificaciones revisadas',
            icon: 'mark_email_read'
        }
    ],

    tableColumns: [
        {
            key: 'id_notificaciones',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_usuario',
            label: 'Usuario',
            type: 'number'
        },
        {
            key: 'id_incidencia',
            label: 'Incidencia',
            type: 'number'
        },
        {
            key: 'id_asistencia',
            label: 'Asistencia',
            type: 'number'
        },
        {
            key: 'tipo',
            label: 'Tipo',
            type: 'badge'
        },
        {
            key: 'titulo',
            label: 'Título',
            type: 'text'
        },
        {
            key: 'mensaje',
            label: 'Mensaje',
            type: 'text'
        },
        {
            key: 'leida',
            label: 'Leída',
            type: 'badge'
        },
        {
            key: 'fecha_envio',
            label: 'Fecha de envío',
            type: 'date'
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
            key: 'id_incidencia',
            label: 'ID Incidencia',
            type: 'number',
            required: true
        },
        {
            key: 'id_asistencia',
            label: 'ID Asistencia',
            type: 'number',
            required: true
        },
        {
            key: 'tipo',
            label: 'Tipo de notificación',
            type: 'select',
            required: true,
            options: [
                {
                    value: 'INCIDENCIA',
                    label: 'Incidencia'
                },
                {
                    value: 'ASISTENCIA',
                    label: 'Asistencia'
                }
            ]
        },
        {
            key: 'titulo',
            label: 'Título',
            type: 'text',
            required: true
        },
        {
            key: 'mensaje',
            label: 'Mensaje',
            type: 'text',
            required: true
        },
        {
            key: 'leida',
            label: 'Leída',
            type: 'checkbox',
            required: true
        },
        {
            key: 'fecha_envio',
            label: 'Fecha de envío',
            type: 'date',
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
            key: 'id_incidencia',
            label: 'ID Incidencia',
            type: 'number',
            required: true
        },
        {
            key: 'id_asistencia',
            label: 'ID Asistencia',
            type: 'number',
            required: true
        },
        {
            key: 'tipo',
            label: 'Tipo de notificación',
            type: 'select',
            required: true,
            options: [
                {
                    value: 'INCIDENCIA',
                    label: 'Incidencia'
                },
                {
                    value: 'ASISTENCIA',
                    label: 'Asistencia'
                }
            ]
        },
        {
            key: 'titulo',
            label: 'Título',
            type: 'text',
            required: true
        },
        {
            key: 'mensaje',
            label: 'Mensaje',
            type: 'text',
            required: true
        },
        {
            key: 'leida',
            label: 'Leída',
            type: 'checkbox',
            required: true
        },
        {
            key: 'fecha_envio',
            label: 'Fecha de envío',
            type: 'date',
            required: true
        }
    ]
};