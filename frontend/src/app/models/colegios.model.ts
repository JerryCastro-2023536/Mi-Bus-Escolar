export const colegiosConfig = {
    title: "Colegios",
    subtitle: "Gestión de colegios registrados",
    apiEndpoint: "/colegios",
    idKey: "id_colegio",

    kpis: [
        {
            title: "Total de colegios",
            valueKey: "total",
            subtitle: "Colegios registrados",
            icon: "🏫"
        }
    ],

    tableColumns: [
        {
            key: "id_colegio",
            label: "ID",
            type: "number"
        },
        {
            key: "nombre",
            label: "Nombre",
            type: "text"
        },
        {
            key: "direccion",
            label: "Dirección",
            type: "text"
        },
        {
            key: "telefono_contacto",
            label: "Teléfono de contacto",
            type: "text"
        }
    ],

    formFields: [
        {
            key: "nombre",
            label: "Nombre del colegio",
            type: "text",
            required: true
        },
        {
            key: "direccion",
            label: "Dirección",
            type: "text",
            required: false
        },
        {
            key: "telefono_contacto",
            label: "Teléfono de contacto",
            type: "text",
            required: false
        }
    ]
};