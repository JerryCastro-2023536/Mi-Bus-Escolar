export const notificacionesConfig = {
    title: "Notificaciones",
    subtitle: "Gestión de notificaciones enviadas a los usuarios",
    apiEndpoint: "/notificaciones",
    idKey: "id_notificacion",

    kpis: [
        {
            title: "Total de notificaciones",
            valueKey: "total",
            subtitle: "Registros totales",
            icon: "🔔"
        },
        {
            title: "No leídas",
            valueKey: "no_leidas",
            subtitle: "Pendientes de revisión",
            icon: "📩"
        },
        {
            title: "Leídas",
            valueKey: "leidas",
            subtitle: "Ya vistas por el usuario",
            icon: "✅"
        },
        {
            title: "Por incidentes",
            valueKey: "por_incidente",
            subtitle: "Notificaciones tipo INCIDENTE",
            icon: "🚨"
        }
    ],

    tableColumns: [
        { key: "id_notificacion", label: "ID", type: "number" },
        { key: "id_usuario", label: "Usuario", type: "number" },
        { key: "tipo", label: "Tipo", type: "badge" },
        { key: "titulo", label: "Título", type: "text" },
        { key: "mensaje", label: "Mensaje", type: "text" },
        { key: "leida", label: "Leída", type: "badge" },
        { key: "fecha_envio", label: "Fecha de envío", type: "date" }
    ],

    formFields: [
        { key: "id_usuario", label: "Usuario", type: "number", required: true },
        { key: "id_incidencia", label: "Incidencia", type: "number", required: false },
        { key: "id_asistencia", label: "Asistencia", type: "number", required: false },
        {
            key: "tipo",
            label: "Tipo",
            type: "select",
            required: true,
            options: [
                { value: "INCIDENTE", label: "Incidente" },
                { value: "ASISTENCIA", label: "Asistencia" },
                { value: "INASISTENCIA", label: "Inasistencia" },
                { value: "OTRO", label: "Otro" }
            ]
        },
        { key: "titulo", label: "Título", type: "text", required: true },
        { key: "mensaje", label: "Mensaje", type: "text", required: true },
        { key: "leida", label: "Leída", type: "checkbox", required: false }
    ]
};
