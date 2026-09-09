export const proveedoresConfig = {
    title: "Proveedores",
    subtitle: "Gestión de proveedores de transporte escolar",
    apiEndpoint: "/proveedores",
    idKey: "id_proveedor",

    kpis: [
        {
            title: "Total de proveedores",
            valueKey: "total",
            subtitle: "Proveedores registrados",
            icon: "🏢"
        },
        {
            title: "Vehículos activos",
            valueKey: "vehiculos_activos",
            subtitle: "Flota en operación",
            icon: "🚐"
        },
        {
            title: "Servicios activos",
            valueKey: "servicios_activos",
            subtitle: "Servicios ofrecidos",
            icon: "📦"
        },
        {
            title: "Calificación promedio",
            valueKey: "calificacion_promedio",
            subtitle: "Basada en valoraciones",
            icon: "⭐"
        }
    ],

    tableColumns: [
        { key: "id_proveedor", label: "ID", type: "number" },
        { key: "id_usuario", label: "Usuario", type: "number" },
        { key: "nombre_negocio", label: "Nombre del negocio", type: "text" },
        { key: "direccion", label: "Dirección", type: "text" },
        { key: "telefono_contacto", label: "Teléfono de contacto", type: "text" }
    ],

    formFields: [
        { key: "id_usuario", label: "Usuario", type: "number", required: true },
        { key: "nombre_negocio", label: "Nombre del negocio", type: "text", required: true },
        { key: "direccion", label: "Dirección", type: "text", required: false },
        { key: "telefono_contacto", label: "Teléfono de contacto", type: "text", required: true }
    ]
};