export const rutaParadaConfig = {
    title: "Ruta - Parada",
    subtitle: "Gestión de las paradas asignadas a cada ruta",
    apiEndpoint: "/ruta-parada",
    idKey: "id_ruta_parada",

    kpis: [
        {
            title: "Total de relaciones",
            valueKey: "total",
            subtitle: "Paradas vinculadas a rutas",
            icon: "🗺️"
        },
        {
            title: "Rutas con paradas",
            valueKey: "rutas_con_paradas",
            subtitle: "Rutas que tienen al menos una parada",
            icon: "🚌"
        },
        {
            title: "Paradas utilizadas",
            valueKey: "paradas_utilizadas",
            subtitle: "Paradas únicas en uso",
            icon: "📍"
        },
        {
            title: "Tiempo promedio estimado",
            valueKey: "minutos_promedio",
            subtitle: "Minutos estimados por parada",
            icon: "⏱️"
        }
    ],

    tableColumns: [
        { key: "id_ruta_parada", label: "ID", type: "number" },
        { key: "id_ruta", label: "Ruta", type: "number" },
        { key: "id_parada", label: "Parada", type: "number" },
        { key: "orden_parada", label: "Orden", type: "number" },
        { key: "minutos_estimados", label: "Minutos estimados", type: "number" },
        { key: "hora_estimada", label: "Hora estimada", type: "text" }
    ],

    formFields: [
        { key: "id_ruta", label: "Ruta", type: "number", required: true },
        { key: "id_parada", label: "Parada", type: "number", required: true },
        { key: "orden_parada", label: "Orden de la parada", type: "number", required: true },
        { key: "minutos_estimados", label: "Minutos estimados", type: "number", required: false },
        { key: "hora_estimada", label: "Hora estimada", type: "text", required: false }
    ]
};