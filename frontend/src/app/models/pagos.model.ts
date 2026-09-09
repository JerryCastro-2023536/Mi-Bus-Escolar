export const pagosConfig = {
    title: "Pagos",
    subtitle: "Gestión de pagos de los estudiantes por servicio",
    apiEndpoint: "/pagos",
    idKey: "id_pago",

    kpis: [
        {
            title: "Total de pagos",
            valueKey: "total",
            subtitle: "Registros totales",
            icon: "💳"
        },
        {
            title: "Pagados",
            valueKey: "pagados",
            subtitle: "Pagos confirmados",
            icon: "✅"
        },
        {
            title: "Pendientes",
            valueKey: "pendientes",
            subtitle: "Por verificar o pagar",
            icon: "⏳"
        },
        {
            title: "Cancelados",
            valueKey: "cancelados",
            subtitle: "Pagos cancelados",
            icon: "❌"
        }
    ],

    tableColumns: [
        { key: "id_pago", label: "ID", type: "number" },
        { key: "id_estudiante", label: "Estudiante", type: "number" },
        { key: "id_servicio", label: "Servicio", type: "number" },
        { key: "periodo_mes", label: "Mes", type: "number" },
        { key: "periodo_anio", label: "Año", type: "number" },
        { key: "monto", label: "Monto", type: "number" },
        { key: "metodo_pago", label: "Método de pago", type: "text" },
        { key: "estado", label: "Estado", type: "badge" },
        { key: "fecha_pago_limite", label: "Fecha límite", type: "date" }
    ],

    formFields: [
        { key: "id_estudiante", label: "Estudiante", type: "number", required: true },
        { key: "id_servicio", label: "Servicio", type: "number", required: true },
        { key: "periodo_mes", label: "Mes", type: "number", required: true },
        { key: "periodo_anio", label: "Año", type: "number", required: true },
        { key: "monto", label: "Monto", type: "number", required: true },
        { key: "metodo_pago", label: "Método de pago", type: "text", required: false },
        { key: "referencia_pago", label: "Referencia de pago", type: "text", required: false },
        { key: "foto_comprobante", label: "Foto de comprobante", type: "text", required: false },
        {
            key: "estado",
            label: "Estado",
            type: "select",
            required: true,
            options: [
                { value: "PENDIENTE", label: "Pendiente" },
                { value: "PAGADO", label: "Pagado" },
                { value: "CANCELADO", label: "Cancelado" }
            ]
        },
        { key: "fecha_pago_limite", label: "Fecha límite de pago", type: "text", required: false },
        { key: "fecha_verificacion", label: "Fecha de verificación", type: "text", required: false },
        { key: "verificado_por", label: "Verificado por (usuario)", type: "number", required: false },
        { key: "observaciones", label: "Observaciones", type: "text", required: false }
    ]
};