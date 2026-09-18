

export const asignacionRutaConfig = {
    title: "Asignaciones de Ruta",
    subtitle: "Gestión de estudiantes asignados a rutas y paradas",
    apiEndpoint: "/asignaciones-ruta",
    idKey: "id_asignacion",

    kpis: [
        {
            title: "Total de asignaciones",
            valueKey: "total",
            subtitle: "Registros totales",
            icon: "🔗"
        },
        {
            title: "Estudiantes asignados",
            valueKey: "estudiantes_asignados",
            subtitle: "Estudiantes únicos",
            icon: "🧒"
        },
        {
            title: "Rutas con asignaciones",
            valueKey: "rutas_con_asignaciones",
            subtitle: "Rutas activas con estudiantes",
            icon: "🚌"
        },
        {
            title: "Sin parada asignada",
            valueKey: "sin_parada",
            subtitle: "Falta parada de recogida o descenso",
            icon: "⚠️"
        }
    ],

    tableColumns: [
        { key: "id_asignacion", label: "ID", type: "number" },
        { key: "id_estudiante", label: "Estudiante", type: "number" },
        { key: "id_ruta", label: "Ruta", type: "number" },
        { key: "id_parada_recogida", label: "Parada de recogida", type: "number" },
        { key: "id_parada_descenso", label: "Parada de descenso", type: "number" }
    ],

    formFields: [
        { key: "id_estudiante", label: "Estudiante", type: "number", required: true },
        { key: "id_ruta", label: "Ruta", type: "number", required: true },
        { key: "id_parada_recogida", label: "Parada de recogida", type: "number", required: false },
        { key: "id_parada_descenso", label: "Parada de descenso", type: "number", required: false }
    ]
};