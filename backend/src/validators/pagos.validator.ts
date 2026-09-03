import z from "zod";
import { EstadoPago } from "../enums/EstadoPago";
import { zUtils } from "../utils/zodHelpers";

export const pagoSchema = z.object({
	id_pago: zUtils.optionalPositiveInt("ID de pago"),

	id_estudiante: zUtils.requiredPositiveInt("ID de estudiante"),

	id_servicio: zUtils.requiredPositiveInt("ID de servicio"),

	periodo_mes: zUtils.requiredPositiveInt("periodo_mes")
		.min(1, "El mes debe estar entre 1 y 12")
		.max(12, "El mes debe estar entre 1 y 12"),

	periodo_anio: zUtils.requiredPositiveInt("periodo_anio"),

	monto: zUtils.requiredNumber("monto")
		.positive("El monto debe ser positivo")
        .min(1, "El monto no puede ser 0"),

	metodo_pago: zUtils.requiredString("metodo_pago")
		.min(1, "El método de pago no puede estar vacío"),

	referencia_pago: zUtils.requiredString("referencia_pago")
		.min(1, "La referencia de pago no puede estar vacía"),

	foto_comprobante: zUtils.requiredString("foto_comprobante")
		.min(1, "La foto del comprobante no puede estar vacía"),

	estado: zUtils.requiredEnum("estado", [
		EstadoPago.PENDIENTE,
		EstadoPago.PAGADO,
		EstadoPago.CANCELADO
	]),

	fecha_pago_limite: zUtils.requiredDate("fecha_pago_limite"),

	fecha_verificacion: zUtils.requiredDate("fecha_verificacion"),

	verificado_por: zUtils.requiredPositiveInt("verificado_por"),

	observaciones: zUtils.requiredString("observaciones")
		.min(1, "Las observaciones no pueden estar vacías")
});

export const createPagoSchema = pagoSchema.omit({
	id_pago: true
});

export const updatePagoSchema = createPagoSchema;
