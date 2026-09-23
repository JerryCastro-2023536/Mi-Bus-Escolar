export const estudiantesConfig = {
    title: 'Estudiantes',
    subtitle: 'Gestiona los estudiantes registrados',
    apiEndpoint: '/estudiantes',
    idKey: 'id_estudiante',

    kpis: [
        {
            title: 'Total estudiantes',
            valueKey: 'total',
            subtitle: 'Estudiantes registrados',
            icon: 'school'
        }
    ],

    tableColumns: [
        {
            key: 'id_estudiante',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_usuario_tutor',
            label: 'Tutor',
            type: 'number'
        },
        {
            key: 'id_colegio',
            label: 'Colegio',
            type: 'number'
        },
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text'
        },
        {
            key: 'apellido',
            label: 'Apellido',
            type: 'text'
        },
        {
            key: 'fecha_nacimiento',
            label: 'Fecha nacimiento',
            type: 'date'
        },
        {
            key: 'foto_estudiante',
            label: 'Foto',
            type: 'image'
        },
        {
            key: 'grado',
            label: 'Grado',
            type: 'text'
        }
    ],

    formFields: [
        {
            key: 'id_usuario_tutor',
            label: 'ID Usuario Tutor',
            type: 'number',
            required: true
        },
        {
            key: 'id_colegio',
            label: 'Colegio',
            type: 'select',
            required: true,
            options: []
        },
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text',
            required: true
        },
        {
            key: 'apellido',
            label: 'Apellido',
            type: 'text',
            required: true
        },
        {
            key: 'fecha_nacimiento',
            label: 'Fecha de nacimiento',
            type: 'date',
            required: true
        },
        {
            key: 'foto_estudiante',
            label: 'Foto del estudiante',
            type: 'image'
        },
        {
            key: 'grado',
            label: 'Grado',
            type: 'text'
        }
    ],

    formFieldsEdit: [
        {
            key: 'id_usuario_tutor',
            label: 'ID Usuario Tutor',
            type: 'number',
            required: true
        },
        {
            key: 'id_colegio',
            label: 'Colegio',
            type: 'select',
            required: true,
            options: []
        },
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text',
            required: true
        },
        {
            key: 'apellido',
            label: 'Apellido',
            type: 'text',
            required: true
        },
        {
            key: 'fecha_nacimiento',
            label: 'Fecha de nacimiento',
            type: 'date',
            required: true
        },
        {
            key: 'foto_estudiante',
            label: 'Foto del estudiante',
            type: 'image'
        },
        {
            key: 'grado',
            label: 'Grado',
            type: 'text'
        }
    ]
};