export const serviciosConfig = {
    title: "Servicios",
    subtitle: "Gestión de servicios de transporte ofrecidos por los proveedores",
    apiEndpoint: "/servicios",
    idKey: "id_servicio",

    kpis: [
        {
            title: "Total de servicios",
            valueKey: "total",
            subtitle: "Servicios registrados",
            icon: "📦"
        },
        {
            title: "Activos",
            valueKey: "activos",
            subtitle: "Servicios disponibles",
            icon: "✅"
        },
        {
            title: "Inactivos",
            valueKey: "inactivos",
            subtitle: "Servicios dados de baja",
            icon: "❌"
        },
        {
            title: "Precio mensual promedio",
            valueKey: "precio_promedio",
            subtitle: "Promedio de todos los servicios",
            icon: "💰"
        }
    ],

    tableColumns: [
        { key: "id_servicio", label: "ID", type: "number" },
        { key: "id_proveedor", label: "Proveedor", type: "number" },
        { key: "nombre", label: "Nombre", type: "text" },
        { key: "descripcion", label: "Descripción", type: "text" },
        { key: "precio_mensual", label: "Precio mensual", type: "number" },
        { key: "estado", label: "Estado", type: "badge" },
        { key: "fecha_creacion", label: "Fecha de creación", type: "date" }
    ],

    formFields: [
        { key: "id_proveedor", label: "Proveedor", type: "number", required: true },
        { key: "nombre", label: "Nombre del servicio", type: "text", required: true },
        { key: "descripcion", label: "Descripción", type: "text", required: false },
        { key: "precio_mensual", label: "Precio mensual", type: "number", required: true },
        {
            key: "estado",
            label: "Estado",
            type: "select",
            required: true,
            options: [
                { value: "ACTIVO", label: "Activo" },
                { value: "INACTIVO", label: "Inactivo" }
            ]
        }
    ]
};