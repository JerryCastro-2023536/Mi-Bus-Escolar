export const rutasConfig = {
    title: "Rutas",
    subtitle: "Gestión de rutas de transporte",
    apiEndpoint: "/rutas",
    idKey: "id_ruta",

    kpis: [
        {
            title: "Total de rutas",
            valueKey: "total",
            subtitle: "Rutas registradas",
            icon: "🛣️"
        },
        {
            title: "Rutas activas",
            valueKey: "activas",
            subtitle: "Rutas disponibles",
            icon: "✅"
        },
        {
            title: "Rutas inactivas",
            valueKey: "inactivas",
            subtitle: "Rutas deshabilitadas",
            icon: "⛔"
        }
    ],

    tableColumns: [
        {
            key: "id_ruta",
            label: "ID",
            type: "number"
        },
        {
            key: "id_servicio",
            label: "Servicio",
            type: "number"
        },
        {
            key: "id_vehiculo",
            label: "Vehículo",
            type: "number"
        },
        {
            key: "id_chofer",
            label: "Chofer",
            type: "number"
        },
        {
            key: "nombre",
            label: "Nombre",
            type: "text"
        },
        {
            key: "hora_inicio_estimada",
            label: "Hora inicio",
            type: "text"
        },
        {
            key: "hora_fin_estimada",
            label: "Hora fin",
            type: "text"
        },
        {
            key: "estado",
            label: "Estado",
            type: "badge"
        }
    ],

    formFields: [
        {
            key: "id_servicio",
            label: "Servicio",
            type: "number",
            required: true
        },
        {
            key: "id_vehiculo",
            label: "Vehículo",
            type: "number",
            required: false
        },
        {
            key: "id_chofer",
            label: "Chofer",
            type: "number",
            required: false
        },
        {
            key: "nombre",
            label: "Nombre de la ruta",
            type: "text",
            required: true
        },
        {
            key: "hora_inicio_estimada",
            label: "Hora de inicio estimada",
            type: "text",
            required: false
        },
        {
            key: "hora_fin_estimada",
            label: "Hora de finalización estimada",
            type: "text",
            required: false
        },
        {
            key: "estado",
            label: "Estado",
            type: "select",
            required: true,
            options: [
                {
                    value: "ACTIVO",
                    label: "Activo"
                },
                {
                    value: "INACTIVO",
                    label: "Inactivo"
                }
            ]
        }
    ]
};