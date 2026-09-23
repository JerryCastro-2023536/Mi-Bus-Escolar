export const valoracionesConfig = {
    title: 'Valoraciones',
    subtitle: 'Gestiona las valoraciones de los servicios',
    apiEndpoint: '/valoraciones',
    idKey: 'id_valoracion',

    kpis: [
        {
            title: 'Total valoraciones',
            valueKey: 'total',
            subtitle: 'Valoraciones registradas',
            icon: 'star'
        },
        {
            title: 'Promedio',
            valueKey: 'promedio',
            subtitle: 'Calificación promedio',
            icon: 'star_half'
        }
    ],

    tableColumns: [
        { key: 'id_valoracion', label: 'ID', type: 'number' },
        { key: 'id_servicio', label: 'Servicio', type: 'number' },
        { key: 'id_usuario', label: 'Usuario', type: 'number' },
        { key: 'comentario', label: 'Comentario', type: 'text' },
        { key: 'calificacion', label: 'Calificación', type: 'number' }
    ],

    formFields: [
        { key: 'id_servicio', label: 'ID Servicio', type: 'number', required: true },
        { key: 'id_usuario', label: 'ID Usuario', type: 'number', required: true },
        { key: 'comentario', label: 'Comentario', type: 'text' },
        { key: 'calificacion', label: 'Calificación (0-5)', type: 'number', required: true }
    ],

    formFieldsEdit: [
        { key: 'id_servicio', label: 'ID Servicio', type: 'number', required: true, readonly: true },
        { key: 'id_usuario', label: 'ID Usuario', type: 'number', required: true, readonly: true },
        { key: 'comentario', label: 'Comentario', type: 'text' },
        { key: 'calificacion', label: 'Calificación (0-5)', type: 'number', required: true }
    ]
};
