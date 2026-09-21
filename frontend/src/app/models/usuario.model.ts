export const usuariosConfig = {
    title: 'Usuarios',
    subtitle: 'Gestiona los usuarios registrados',
    apiEndpoint: '/usuarios',
    idKey: 'id_usuario',

    kpis: [
        {
            title: 'Total usuarios',
            valueKey: 'total',
            subtitle: 'Usuarios registrados',
            icon: 'people'
        },
        {
            title: 'Correos verificados',
            valueKey: 'verificados',
            subtitle: 'Usuarios con correo verificado',
            icon: 'verified'
        }
    ],

    tableColumns: [
        {
            key: 'id_usuario',
            label: 'ID',
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
            key: 'correo',
            label: 'Correo',
            type: 'text'
        },
        {
            key: 'telefono',
            label: 'Teléfono',
            type: 'text'
        },
        {
            key: 'foto_usuario',
            label: 'Foto',
            type: 'image'
        },
        {
            key: 'rol',
            label: 'Rol',
            type: 'badge'
        },
        {
            key: 'correo_verificado',
            label: 'Correo verificado',
            type: 'badge'
        },
        {
            key: 'fecha_creacion',
            label: 'Fecha de creación',
            type: 'date'
        },
        {
            key: 'fecha_actualizacion',
            label: 'Última actualización',
            type: 'date'
        }
    ],

    formFields: [
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
            key: 'correo',
            label: 'Correo',
            type: 'email',
            required: true
        },
        {
            key: 'password',
            label: 'Contraseña',
            type: 'password',
            required: true
        },
        {
            key: 'telefono',
            label: 'Teléfono',
            type: 'text',
            required: true
        },
        {
            key: 'foto_usuario',
            label: 'Foto del usuario',
            type: 'image'
        },
        {
            key: 'rol',
            label: 'Rol',
            type: 'select',
            required: true,
            options: [
                {
                    value: 'ADMINISTRADOR',
                    label: 'Administrador'
                },
                {
                    value: 'PROVEEDOR',
                    label: 'Proveedor'
                },
                {
                    value: 'CHOFER',
                    label: 'Chofer'
                },
                {
                    value: 'USUARIO',
                    label: 'Usuario'
                }
            ]
        },
        {
            key: 'correo_verificado',
            label: 'Correo verificado',
            type: 'checkbox'
        }
    ],

    formFieldsEdit: [
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
            key: 'correo',
            label: 'Correo',
            type: 'email',
            required: true
        },
        {
            key: 'password',
            label: 'Contraseña',
            type: 'password'
        },
        {
            key: 'telefono',
            label: 'Teléfono',
            type: 'text',
            required: true
        },
        {
            key: 'foto_usuario',
            label: 'Foto del usuario',
            type: 'image'
        },
        {
            key: 'rol',
            label: 'Rol',
            type: 'select',
            required: true,
            options: [
                {
                    value: 'ADMINISTRADOR',
                    label: 'Administrador'
                },
                {
                    value: 'PROVEEDOR',
                    label: 'Proveedor'
                },
                {
                    value: 'CHOFER',
                    label: 'Chofer'
                },
                {
                    value: 'USUARIO',
                    label: 'Usuario'
                }
            ]
        },
        {
            key: 'correo_verificado',
            label: 'Correo verificado',
            type: 'checkbox'
        }
    ]
};