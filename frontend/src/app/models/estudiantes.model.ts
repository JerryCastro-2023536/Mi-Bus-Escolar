export const estudiantesConfig = {
    title: "Estudiantes",
    subtitle: "Gestión de estudiantes registrados",
    apiEndpoint: "/estudiantes",
    idKey: "id_estudiante",

    kpis: [
        {
            title: "Total de estudiantes",
            valueKey: "total",
            subtitle: "Estudiantes registrados",
            icon: "🎓"
        }
    ],

    tableColumns: [
        {
            key: "id_estudiante",
            label: "ID",
            type: "number"
        },
        {
            key: "id_usuario_tutor",
            label: "Tutor",
            type: "number"
        },
        {
            key: "id_colegio",
            label: "Colegio",
            type: "number"
        },
        {
            key: "nombre",
            label: "Nombre",
            type: "text"
        },
        {
            key: "apellido",
            label: "Apellido",
            type: "text"
        },
        {
            key: "fecha_nacimiento",
            label: "Fecha de nacimiento",
            type: "date"
        },
        {
            key: "foto_estudiante",
            label: "Foto",
            type: "text"
        },
        {
            key: "grado",
            label: "Grado",
            type: "text"
        }
    ],

    formFields: [
        {
            key: "id_usuario_tutor",
            label: "Tutor",
            type: "number",
            required: true
        },
        {
            key: "id_colegio",
            label: "Colegio",
            type: "number",
            required: false
        },
        {
            key: "nombre",
            label: "Nombre",
            type: "text",
            required: true
        },
        {
            key: "apellido",
            label: "Apellido",
            type: "text",
            required: true
        },
        {
            key: "fecha_nacimiento",
            label: "Fecha de nacimiento",
            type: "date",
            required: true
        },
        {
            key: "foto_estudiante",
            label: "Foto del estudiante",
            type: "text",
            required: false
        },
        {
            key: "grado",
            label: "Grado",
            type: "text",
            required: false
        }
    ]
};