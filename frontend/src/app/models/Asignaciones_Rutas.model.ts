export const asignacionesRutaConfig = {
    title: 'Asignaciones de Ruta',
    subtitle: 'Gestiona las asignaciones de estudiantes a las rutas',
    apiEndpoint: '/asignaciones',
    idKey: 'id_asignacion',

    kpis: [
        {
            title: 'Total asignaciones',
            valueKey: 'total',
            subtitle: 'Asignaciones registradas',
            icon: 'assignment'
        }
    ],

    tableColumns: [
        {
            key: 'id_asignacion',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_estudiante',
            label: 'Estudiante',
            type: 'number'
        },
        {
            key: 'id_ruta',
            label: 'Ruta',
            type: 'number'
        },
        {
            key: 'id_parada_recogida',
            label: 'Parada de recogida',
            type: 'number'
        },
        {
            key: 'id_parada_descenso',
            label: 'Parada de descenso',
            type: 'number'
        }
    ],

    formFields: [
        {
            key: 'id_estudiante',
            label: 'ID Estudiante',
            type: 'number',
            required: true
        },
        {
            key: 'id_ruta',
            label: 'ID Ruta',
            type: 'number',
            required: true
        },
        {
            key: 'id_parada_recogida',
            label: 'ID Parada de recogida',
            type: 'number',
            required: true
        },
        {
            key: 'id_parada_descenso',
            label: 'ID Parada de descenso',
            type: 'number',
            required: true
        }
    ],

    formFieldsEdit: [
        {
            key: 'id_estudiante',
            label: 'ID Estudiante',
            type: 'number',
            required: true
        },
        {
            key: 'id_ruta',
            label: 'ID Ruta',
            type: 'number',
            required: true
        },
        {
            key: 'id_parada_recogida',
            label: 'ID Parada de recogida',
            type: 'number',
            required: true
        },
        {
            key: 'id_parada_descenso',
            label: 'ID Parada de descenso',
            type: 'number',
            required: true
        }
    ]
};