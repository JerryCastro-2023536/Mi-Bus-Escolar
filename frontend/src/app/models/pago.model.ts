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
            type: 'datetime'
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
                    value: 'PAGADO',
                    label: 'Pagado'
                },
                {
                    value: 'CANCELADO',
                    label: 'Cancelado'
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
            type: 'date',
            required: true
        },
        {
            key: 'verificado_por',
            label: 'Verificado por',
            type: 'number',
            required: true
        },
        {
            key: 'observaciones',
            label: 'Observaciones',
            type: 'text',
            required: true
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
                    value: 'PAGADO',
                    label: 'Pagado'
                },
                {
                    value: 'CANCELADO',
                    label: 'Cancelado'
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
            type: 'date',
            required: true
        },
        {
            key: 'verificado_por',
            label: 'Verificado por',
            type: 'number',
            required: true
        },
        {
            key: 'observaciones',
            label: 'Observaciones',
            type: 'text',
            required: true
        }
    ]
};
export interface MesPago {
    id_servicio: number;
    nombre_servicio: string;
    precio_mensual: number;
    periodo_mes: number;
    periodo_anio: number;
    id_pago: number | null;
    estado: 'PENDIENTE' | 'PAGADO' | 'CANCELADO';
    monto: number | null;
    metodo_pago: string | null;
    referencia_pago: string | null;
    foto_comprobante: string | null;
    fecha_pago_limite: string | null;
    fecha_verificacion: string | null;
}

export interface EstudianteResumen {
    id_estudiante: number;
    nombre: string;
    apellido: string;
    foto_estudiante: string | null;
    grado: string | null;
    nombre_colegio: string | null;
}

export interface RegistrarPagoPayload {
    id_estudiante: number;
    id_servicio: number;
    periodo_mes: number;
    periodo_anio: number;
    metodo_pago: string;
    referencia_pago?: string;
    foto_comprobante?: string;
}
