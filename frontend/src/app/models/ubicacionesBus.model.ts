export const ubicacionesBusConfig = {
    title: "Ubicaciones del Bus",
    subtitle: "Rastreo GPS de los vehículos durante los viajes",
    apiEndpoint: "/ubicaciones-bus",
    idKey: "id_ubicacion",

    kpis: [
        {
            title: "Total de ubicaciones",
            valueKey: "total",
            subtitle: "Registros de rastreo",
            icon: "📡"
        },
        {
            title: "Viajes rastreados",
            valueKey: "viajes_rastreados",
            subtitle: "Viajes con datos de ubicación",
            icon: "🚌"
        },
        {
            title: "Velocidad promedio",
            valueKey: "velocidad_promedio",
            subtitle: "Km/h promedio registrado",
            icon: "🏎️"
        },
        {
            title: "Última actualización",
            valueKey: "ultima_actualizacion",
            subtitle: "Registro más reciente",
            icon: "🕒"
        }
    ],

    tableColumns: [
        { key: "id_ubicacion", label: "ID", type: "number" },
        { key: "id_viaje", label: "Viaje", type: "number" },
        { key: "latitud", label: "Latitud", type: "number" },
        { key: "longitud", label: "Longitud", type: "number" },
        { key: "velocidad", label: "Velocidad", type: "number" },
        { key: "fecha_hora", label: "Fecha y hora", type: "date" }
    ],

    formFields: [
        { key: "id_viaje", label: "Viaje", type: "number", required: true },
        { key: "latitud", label: "Latitud", type: "number", required: true },
        { key: "longitud", label: "Longitud", type: "number", required: true },
        { key: "velocidad", label: "Velocidad", type: "number", required: false }
    ]
};
