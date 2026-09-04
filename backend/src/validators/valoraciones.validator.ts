import { z } from "zod";
import { zUtils } from "../utils/zodHelpers";

const valoracionSchema = z.object({
    id_valoracion: zUtils.optionalPositiveInt("ID de la valoración"),

    id_proveedor: zUtils.requiredPositiveInt("ID del proveedor"),

    comentario: z.string({
        error: (issue) => {
            if (issue.input === undefined) {
                return undefined;
            }

            return "El comentario debe ser un texto";
        },
    })
        .max(1000, "El comentario no puede exceder los 1000 caracteres")
        .nullable()
        .optional(),

    calificacion: zUtils.requiredPositiveInt("calificación")
        .min(1, "La calificación debe ser como mínimo 1")
        .max(5, "La calificación no puede ser mayor a 5"),
});

export const createValoracionSchema = valoracionSchema.omit({
    id_valoracion: true,
});

export const updateValoracionSchema = createValoracionSchema;