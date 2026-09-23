import z from "zod";
import { zUtils } from "../utils/zodHelpers";

export const asignacionRutaSchema = z.object({
	id_asignacion: zUtils.optionalPositiveInt("ID de asignación"),

	id_estudiante: zUtils.requiredPositiveInt("ID de estudiante"),

	id_ruta: zUtils.requiredPositiveInt("ID de ruta"),

	id_parada_recogida: z.number().int().positive().nullable().optional(),

	id_parada_descenso: z.number().int().positive().nullable().optional()
});

export const createAsignacionRutaSchema = asignacionRutaSchema.omit({
	id_asignacion: true
});

export const updateAsignacionRutaSchema = createAsignacionRutaSchema;

