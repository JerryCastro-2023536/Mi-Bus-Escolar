export const asistenciasConfig = {
    title: 'Asistencias',
    subtitle: 'Control de abordaje y descenso de estudiantes',
    apiEndpoint: '/asistencias',
    idKey: 'id_asistencia',

    kpis: [
        {
            title: 'Total asistencias',
            valueKey: 'total',
            subtitle: 'Registros de asistencia',
            icon: 'groups'
        },
        {
            title: 'Presentes',
            valueKey: 'presentes',
            subtitle: 'Estudiantes presentes',
            icon: 'check_circle'
        },
        {
            title: 'Ausentes',
            valueKey: 'ausentes',
            subtitle: 'Estudiantes ausentes',
            icon: 'cancel'
        }
    ],

    tableColumns: [
        {
            key: 'id_asistencia',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_viaje',
            label: 'Viaje',
            type: 'number'
        },
        {
            key: 'id_estudiante',
            label: 'Estudiante',
            type: 'number'
        },
        {
            key: 'estado_abordaje',
            label: 'Abordaje',
            type: 'badge'
        },
        {
            key: 'hora_abordaje',
            label: 'Hora abordaje',
            type: 'text'
        },
        {
            key: 'estado_descenso',
            label: 'Descenso',
            type: 'badge'
        },
        {
            key: 'hora_descenso',
            label: 'Hora descenso',
            type: 'text'
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
            key: 'id_estudiante',
            label: 'ID Estudiante',
            type: 'number',
            required: true
        },
        {
            key: 'estado_abordaje',
            label: 'Estado de abordaje',
            type: 'select',
            options: [
                {
                    value: 'PENDIENTE',
                    label: 'Pendiente'
                },
                {
                    value: 'PRESENTE',
                    label: 'Presente'
                },
                {
                    value: 'AUSENTE',
                    label: 'Ausente'
                }
            ]
        },
        {
            key: 'hora_abordaje',
            label: 'Hora de abordaje',
            type: 'text'
        },
        {
            key: 'estado_descenso',
            label: 'Estado de descenso',
            type: 'select',
            options: [
                {
                    value: 'PENDIENTE',
                    label: 'Pendiente'
                },
                {
                    value: 'PRESENTE',
                    label: 'Presente'
                },
                {
                    value: 'AUSENTE',
                    label: 'Ausente'
                }
            ]
        },
        {
            key: 'hora_descenso',
            label: 'Hora de descenso',
            type: 'text'
        }
    ]
};