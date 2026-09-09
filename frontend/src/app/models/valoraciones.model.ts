export const valoracionesConfig = {
    title: "Valoraciones",
    subtitle: "Gestión de valoraciones de proveedores",
    apiEndpoint: "/valoraciones",
    idKey: "id_valoracion",

    kpis: [
        {
            title: "Total de valoraciones",
            valueKey: "total",
            subtitle: "Valoraciones registradas",
            icon: "⭐"
        },
        {
            title: "Calificación promedio",
            valueKey: "promedio",
            subtitle: "Promedio general",
            icon: "📊"
        }
    ],

    tableColumns: [
        {
            key: "id_valoracion",
            label: "ID",
            type: "number"
        },
        {
            key: "id_proveedor",
            label: "Proveedor",
            type: "number"
        },
        {
            key: "comentario",
            label: "Comentario",
            type: "text"
        },
        {
            key: "calificacion",
            label: "Calificación",
            type: "number"
        }
    ],

    formFields: [
        {
            key: "id_proveedor",
            label: "Proveedor",
            type: "number",
            required: true
        },
        {
            key: "comentario",
            label: "Comentario",
            type: "text",
            required: false
        },
        {
            key: "calificacion",
            label: "Calificación",
            type: "number",
            required: true
        }
    ]
};