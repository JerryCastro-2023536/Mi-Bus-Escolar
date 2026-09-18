export const pagosConfig = {
    title: 'Pagos',
    subtitle: 'Gestiona los pagos de los estudiantes',
    apiEndpoint: '/pagos',
    idKey: 'id_pago',

    kpis: [
        {
            title: 'Total pagos',
            valueKey: 'total',
            subtitle: 'Pagos registrados',
            icon: 'payments'
        },
        {
            title: 'Pagos pendientes',
            valueKey: 'pendientes',
            subtitle: 'Pagos por verificar',
            icon: 'pending'
        },
        {
            title: 'Pagos verificados',
            valueKey: 'verificados',
            subtitle: 'Pagos confirmados',
            icon: 'check_circle'
        }
    ],

    tableColumns: [
        {
            key: 'id_pago',
            label: 'ID',
            type: 'number'
        },
        {
            key: 'id_estudiante',
            label: 'Estudiante',
            type: 'number'
        },
        {
            key: 'id_servicio',
            label: 'Servicio',
            type: 'number'
        },
        {
            key: 'periodo_mes',
            label: 'Mes',
            type: 'number'
        },
        {
            key: 'periodo_anio',
            label: 'Año',
            type: 'number'
        },
        {
            key: 'monto',
            label: 'Monto',
            type: 'number'
        },
        {
            key: 'metodo_pago',
            label: 'Método de pago',
            type: 'text'
        },
        {
            key: 'referencia_pago',
            label: 'Referencia',
            type: 'text'
        },
        {
            key: 'foto_comprobante',
            label: 'Comprobante',
            type: 'image'
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'badge'
        },
        {
            key: 'fecha_pago_limite',
            label: 'Fecha límite',
            type: 'date'
        },
        {
            key: 'fecha_verificacion',
            label: 'Fecha verificación',
            type: 'date'
        },
        {
            key: 'verificado_por',
            label: 'Verificado por',
            type: 'number'
        },
        {
            key: 'observaciones',
            label: 'Observaciones',
            type: 'text'
        }
    ],

    formFields: [
        {
            key: 'id_estudiante',
            label: 'ID Estudiante',
            type: 'number',
            required: true
        },
        {
            key: 'id_servicio',
            label: 'ID Servicio',
            type: 'number',
            required: true
        },
        {
            key: 'periodo_mes',
            label: 'Mes',
            type: 'number',
            required: true
        },
        {
            key: 'periodo_anio',
            label: 'Año',
            type: 'number',
            required: true
        },
        {
            key: 'monto',
            label: 'Monto',
            type: 'number',
            required: true
        },
        {
            key: 'metodo_pago',
            label: 'Método de pago',
            type: 'text',
            required: true
        },
        {
            key: 'referencia_pago',
            label: 'Referencia de pago',
            type: 'text',
            required: true
        },
        {
            key: 'foto_comprobante',
            label: 'Foto del comprobante',
            type: 'image',
            required: true
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'select',
            required: true,
            options: [
                {
                    value: 'PENDIENTE',
                    label: 'Pendiente'
                },
                {
                    value: 'VERIFICADO',
                    label: 'Verificado'
                },
                {
                    value: 'RECHAZADO',
                    label: 'Rechazado'
                }
            ]
        },
        {
            key: 'fecha_pago_limite',
            label: 'Fecha límite de pago',
            type: 'date',
            required: true
        },
        {
            key: 'fecha_verificacion',
            label: 'Fecha de verificación',
            type: 'date'
        },
        {
            key: 'verificado_por',
            label: 'Verificado por',
            type: 'number'
        },
        {
            key: 'observaciones',
            label: 'Observaciones',
            type: 'text'
        }
    ],

    formFieldsEdit: [
        {
            key: 'id_estudiante',
            label: 'ID Estudiante',
            type: 'number',
            required: true
        },
        {
            key: 'id_servicio',
            label: 'ID Servicio',
            type: 'number',
            required: true
        },
        {
            key: 'periodo_mes',
            label: 'Mes',
            type: 'number',
            required: true
        },
        {
            key: 'periodo_anio',
            label: 'Año',
            type: 'number',
            required: true
        },
        {
            key: 'monto',
            label: 'Monto',
            type: 'number',
            required: true
        },
        {
            key: 'metodo_pago',
            label: 'Método de pago',
            type: 'text',
            required: true
        },
        {
            key: 'referencia_pago',
            label: 'Referencia de pago',
            type: 'text',
            required: true
        },
        {
            key: 'foto_comprobante',
            label: 'Foto del comprobante',
            type: 'image',
            required: true
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'select',
            required: true,
            options: [
                {
                    value: 'PENDIENTE',
                    label: 'Pendiente'
                },
                {
                    value: 'VERIFICADO',
                    label: 'Verificado'
                },
                {
                    value: 'RECHAZADO',
                    label: 'Rechazado'
                }
            ]
        },
        {
            key: 'fecha_pago_limite',
            label: 'Fecha límite de pago',
            type: 'date',
            required: true
        },
        {
            key: 'fecha_verificacion',
            label: 'Fecha de verificación',
            type: 'date'
        },
        {
            key: 'verificado_por',
            label: 'Verificado por',
            type: 'number'
        },
        {
            key: 'observaciones',
            label: 'Observaciones',
            type: 'text'
        }
    ]
};