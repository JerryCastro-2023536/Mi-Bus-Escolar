export const vehiculosConfig = {
    title: "Vehículos",
    subtitle: "Gestión de vehículos registrados",
    apiEndpoint: "/vehiculos",
    idKey: "id_vehiculo",

    kpis: [
        {
            title: "Total de vehículos",
            valueKey: "total",
            subtitle: "Vehículos registrados",
            icon: "🚐"
        },
        {
            title: "Vehículos activos",
            valueKey: "activos",
            subtitle: "Vehículos disponibles",
            icon: "✅"
        },
        {
            title: "Vehículos inactivos",
            valueKey: "inactivos",
            subtitle: "Vehículos fuera de servicio",
            icon: "⛔"
        }
    ],

    tableColumns: [
        {
            key: "id_vehiculo",
            label: "ID",
            type: "number"
        },
        {
            key: "id_proveedor",
            label: "Proveedor",
            type: "number"
        },
        {
            key: "placa",
            label: "Placa",
            type: "text"
        },
        {
            key: "foto_vehiculo",
            label: "Foto",
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
            key: "id_proveedor",
            label: "Proveedor",
            type: "number",
            required: true
        },
        {
            key: "placa",
            label: "Placa",
            type: "text",
            required: true
        },
        {
            key: "foto_vehiculo",
            label: "Foto del vehículo",
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