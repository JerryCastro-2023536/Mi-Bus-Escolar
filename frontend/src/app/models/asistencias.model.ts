export const asistenciasConfig = {
    title: "Asistencias",
    subtitle: "Gestión de asistencias de estudiantes en los viajes",
    apiEndpoint: "/asistencias",
    idKey: "id_asistencia",

    kpis: [
        {
            title: "Total de asistencias",
            valueKey: "total",
            subtitle: "Registros de asistencia",
            icon: "📋"
        },
        {
            title: "Presentes",
            valueKey: "presentes",
            subtitle: "Estudiantes presentes",
            icon: "✅"
        },
        {
            title: "Ausentes",
            valueKey: "ausentes",
            subtitle: "Estudiantes ausentes",
            icon: "❌"
        },
        {
            title: "Pendientes",
            valueKey: "pendientes",
            subtitle: "Por confirmar",
            icon: "⏳"
        }
    ],

    tableColumns: [
        {
            key: "id_asistencia",
            label: "ID",
            type: "number"
        },
        {
            key: "id_viaje",
            label: "Viaje",
            type: "number"
        },
        {
            key: "id_estudiante",
            label: "Estudiante",
            type: "number"
        },
        {
            key: "estado_abordaje",
            label: "Estado de abordaje",
            type: "badge"
        },
        {
            key: "hora_abordaje",
            label: "Hora de abordaje",
            type: "date"
        },
        {
            key: "estado_descenso",
            label: "Estado de descenso",
            type: "text"
        },
        {
            key: "hora_descenso",
            label: "Hora de descenso",
            type: "date"
        }
    ],

    formFields: [
        {
            key: "id_viaje",
            label: "Viaje",
            type: "number",
            required: true
        },
        {
            key: "id_estudiante",
            label: "Estudiante",
            type: "number",
            required: true
        },
        {
            key: "estado_abordaje",
            label: "Estado de abordaje",
            type: "select",
            required: true,
            options: [
                {
                    value: "PENDIENTE",
                    label: "Pendiente"
                },
                {
                    value: "PRESENTE",
                    label: "Presente"
                },
                {
                    value: "AUSENTE",
                    label: "Ausente"
                }
            ]
        },
        {
            key: "hora_abordaje",
            label: "Hora de abordaje",
            type: "date",
            required: false
        },
        {
            key: "estado_descenso",
            label: "Estado de descenso",
            type: "text",
            required: false
        },
        {
            key: "hora_descenso",
            label: "Hora de descenso",
            type: "date",
            required: false
        }
    ]
};