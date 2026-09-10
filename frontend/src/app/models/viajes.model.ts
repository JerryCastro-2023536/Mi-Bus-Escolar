export const viajesConfig = {
    title: "Viajes",
    subtitle: "Gestión de los viajes realizados por cada ruta",
    apiEndpoint: "/viajes",
    idKey: "id_viaje",

    kpis: [
        {
            title: "Total de viajes",
            valueKey: "total",
            subtitle: "Viajes registrados",
            icon: "🚌"
        },
        {
            title: "Programados",
            valueKey: "programados",
            subtitle: "Viajes por realizar",
            icon: "🗓️"
        },
        {
            title: "Activos",
            valueKey: "activos",
            subtitle: "Viajes en curso",
            icon: "🟢"
        },
        {
            title: "Finalizados",
            valueKey: "finalizados",
            subtitle: "Viajes completados",
            icon: "🏁"
        }
    ],

    tableColumns: [
        { key: "id_viaje", label: "ID", type: "number" },
        { key: "id_ruta", label: "Ruta", type: "number" },
        { key: "id_chofer", label: "Chofer", type: "number" },
        { key: "id_vehiculo", label: "Vehículo", type: "number" },
        { key: "fecha_viaje", label: "Fecha del viaje", type: "date" },
        { key: "hora_inicio", label: "Hora de inicio", type: "text" },
        { key: "hora_fin", label: "Hora de fin", type: "text" },
        { key: "estado", label: "Estado", type: "badge" }
    ],

    formFields: [
        { key: "id_ruta", label: "Ruta", type: "number", required: false },
        { key: "id_chofer", label: "Chofer", type: "number", required: false },
        { key: "id_vehiculo", label: "Vehículo", type: "number", required: false },
        { key: "fecha_viaje", label: "Fecha del viaje", type: "text", required: true },
        { key: "hora_inicio", label: "Hora de inicio", type: "text", required: false },
        { key: "hora_fin", label: "Hora de fin", type: "text", required: false },
        {
            key: "estado",
            label: "Estado",
            type: "select",
            required: true,
            options: [
                { value: "PROGRAMADO", label: "Programado" },
                { value: "ACTIVO", label: "Activo" },
                { value: "FINALIZADO", label: "Finalizado" }
            ]
        }
    ]
};