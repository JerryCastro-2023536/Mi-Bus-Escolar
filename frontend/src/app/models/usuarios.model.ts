import { CrudConfig } from "./crudDTO.interface";

export const usuariosConfig: CrudConfig = {
    title: 'Gestión de Usuarios',
    subtitle: 'Cuentas, roles y permisos de acceso a la plataforma.',
    apiEndpoint: '/usuarios',
    idKey: 'id_usuario',
    kpis: [
        { title: 'USUARIOS TOTALES', valueKey: 'total' },
        { title: 'ACTIVOS HOY', valueKey: 'activos' }
    ],

    tableColumns: [
        { key: 'id_usuario', label: 'ID', type: 'text' },
        { key: 'nombre', label: 'NOMBRE', type: 'text' },
        { key: 'apellido', label: 'APELLIDO', type: 'text' },
        { key: 'correo', label: 'CORREO', type: 'text' },
        { key: 'telefono', label: 'TELÉFONO', type: 'text' },
        { key: 'rol', label: 'ROL', type: 'badge' },
        { key: 'correo_verificado', label: 'VERIFICADO', type: 'text' }
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
            label: 'Correo Electrónico',
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
            label: 'URL de Foto de Perfil',
            type: 'text',
            required: false
        },
        {
            key: 'rol',
            label: 'Rol del Sistema',
            type: 'select',
            required: true,
            options: [
                { value: 'ADMINISTRADOR', label: 'Administrador' },
                { value: 'PROVEEDOR', label: 'Proveedor' },
                { value: 'CHOFER', label: 'Chofer' },
                { value: 'USUARIO', label: 'Usuario' }
            ]
        },
        {
            key: 'correo_verificado',
            label: '¿Correo Verificado?',
            type: 'checkbox',
            required: false
        }
    ]
};