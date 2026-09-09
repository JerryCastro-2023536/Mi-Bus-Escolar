import { CrudConfig } from "./crudDTO.interface";

export const choferesCrudConfig: CrudConfig = {
    title: 'Choferes',
    subtitle: 'Gestión y administración de los choferes del sistema',
    apiEndpoint: '/choferes',
    idKey: 'id_chofer',
    kpis: [
        {
            title: 'Total de Choferes',
            valueKey: 'totalChoferes',
            icon: 'users' 
        },
        {
            title: 'Choferes Activos',
            valueKey: 'choferesActivos',
            subtitle: 'En servicio',
            icon: 'check-circle'
        }
    ],
    tableColumns: [
        {
            key: 'id_chofer',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_usuario',
            label: 'ID Usuario',
            type: 'text'
        },
        {
            key: 'telefono_contacto',
            label: 'Teléfono',
            type: 'text'
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'badge' 
        }
    ],
    formFields: [
        {
            key: 'id_usuario',
            label: 'ID de Usuario',
            type: 'number',
            required: true
        },
        {
            key: 'telefono_contacto',
            label: 'Teléfono de Contacto',
            type: 'text',
            required: true
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'select',
            required: true,
            options: [
                { value: 'ACTIVO', label: 'Activo' },
                { value: 'INACTIVO', label: 'Inactivo' }
            ]
        }
    ]
};