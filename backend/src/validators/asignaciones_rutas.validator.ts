import z from "zod";
import { zUtils } from "../utils/zodHelpers";

export const asignacionRutaSchema = z.object({
	id_asignacion: zUtils.optionalPositiveInt("ID de asignación"),

	id_estudiante: zUtils.requiredPositiveInt("ID de estudiante"),

	id_ruta: zUtils.requiredPositiveInt("ID de ruta"),

	id_parada_recogida: zUtils.requiredPositiveInt("ID de parada de recogida"),

	id_parada_descenso: zUtils.requiredPositiveInt("ID de parada de descenso")
});

export const createAsignacionRutaSchema = asignacionRutaSchema.omit({
	id_asignacion: true
});

export const updateAsignacionRutaSchema = createAsignacionRutaSchema;
