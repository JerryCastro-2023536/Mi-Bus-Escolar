export const incidenciasConfig = {
    title: "Incidencias",
    subtitle: "Gestión de incidencias reportadas",
    apiEndpoint: "/incidencias",
    idKey: "id_incidencia",

    kpis: [
        {
            title: "Total de incidencias",
            valueKey: "total",
            subtitle: "Incidencias registradas",
            icon: "⚠️"
        },
        {
            title: "Incidencias abiertas",
            valueKey: "abiertas",
            subtitle: "Incidencias pendientes",
            icon: "🔓"
        },
        {
            title: "Incidencias cerradas",
            valueKey: "cerradas",
            subtitle: "Incidencias solucionadas",
            icon: "🔒"
        }
    ],

    tableColumns: [
        {
            key: "id_incidencia",
            label: "ID",
            type: "number"
        },
        {
            key: "id_viaje",
            label: "Viaje",
            type: "number"
        },
        {
            key: "id_ruta",
            label: "Ruta",
            type: "number"
        },
        {
            key: "id_usuario_reporta",
            label: "Usuario reporta",
            type: "number"
        },
        {
            key: "titulo",
            label: "Título",
            type: "text"
        },
        {
            key: "descripcion",
            label: "Descripción",
            type: "text"
        },
        {
            key: "latitud",
            label: "Latitud",
            type: "number"
        },
        {
            key: "longitud",
            label: "Longitud",
            type: "number"
        },
        {
            key: "fecha_hora",
            label: "Fecha y hora",
            type: "date"
        },
        {
            key: "estado",
            label: "Estado",
            type: "badge"
        }
    ],

    formFields: [
        {
            key: "id_viaje",
            label: "Viaje",
            type: "number",
            required: false
        },
        {
            key: "id_ruta",
            label: "Ruta",
            type: "number",
            required: true
        },
        {
            key: "id_usuario_reporta",
            label: "Usuario que reporta",
            type: "number",
            required: false
        },
        {
            key: "titulo",
            label: "Título",
            type: "text",
            required: true
        },
        {
            key: "descripcion",
            label: "Descripción",
            type: "text",
            required: false
        },
        {
            key: "latitud",
            label: "Latitud",
            type: "number",
            required: false
        },
        {
            key: "longitud",
            label: "Longitud",
            type: "number",
            required: false
        },
        {
            key: "fecha_hora",
            label: "Fecha y hora",
            type: "date",
            required: true
        },
        {
            key: "estado",
            label: "Estado",
            type: "select",
            required: true,
            options: [
                {
                    value: "ABIERTA",
                    label: "Abierta"
                },
                {
                    value: "CERRADA",
                    label: "Cerrada"
                }
            ]
        }
    ]
};