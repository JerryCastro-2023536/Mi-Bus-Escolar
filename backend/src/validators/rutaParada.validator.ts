import { z } from "zod";
import { zUtils } from "../utils/zodHelpers"; 

const baseRutaParadaSchema = z.object({
    id_ruta_parada: zUtils.optionalPositiveInt("ID de ruta parada"),

    id_ruta: zUtils.requiredPositiveInt("ID de ruta"),

    id_parada: zUtils.requiredPositiveInt("ID de parada"),

    orden_parada: zUtils.requiredPositiveInt("orden de parada"),

    minutos_estimados: z.number({
        error: (issue) => {
            if (issue.input === undefined) return undefined;
            return "Los minutos estimados deben ser un número";
        },
    })
    .int("Los minutos estimados deben ser un número entero")
    .nonnegative("Los minutos estimados no pueden ser negativos")
    .nullable()
    .optional(),

    hora_estimada: zUtils.optionalTimeString("hora estimada"),
});

export const createRutaParadaSchema = baseRutaParadaSchema.omit({
    id_ruta_parada: true,
});

export const updateRutaParadaSchema = createRutaParadaSchema;

export type RutaParada = z.infer<typeof baseRutaParadaSchema>;