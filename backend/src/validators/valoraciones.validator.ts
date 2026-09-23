import { z } from "zod";
import { zUtils } from "../utils/zodHelpers";

const calificacionSchema = z.number({
    error: (issue) => {
        if (issue.input === undefined) return "La calificación es obligatoria";
        return "La calificación debe ser un número";
    },
})
    .int("La calificación debe ser un número entero")
    .min(0, "La calificación debe ser como mínimo 0")
    .max(5, "La calificación no puede ser mayor a 5");

const comentarioSchema = z.string({
    error: (issue) => {
        if (issue.input === undefined) return undefined;
        return "El comentario debe ser un texto";
    },
})
    .trim()
    .max(1000, "El comentario no puede exceder los 1000 caracteres")
    .nullable()
    .optional();

const valoracionSchema = z.object({
    id_valoracion: zUtils.optionalPositiveInt("ID de la valoración"),
    id_servicio: zUtils.requiredPositiveInt("ID del servicio"),
    id_usuario: zUtils.requiredPositiveInt("ID del usuario"),
    comentario: comentarioSchema,
    calificacion: calificacionSchema,
});

export const createValoracionSchema = valoracionSchema.omit({
    id_valoracion: true,
});

export const updateValoracionSchema = createValoracionSchema;

// En la landing el usuario y el servicio no se aceptan desde el body:
// ambos se obtienen de la sesión y de la URL.
export const valorarServicioSchema = z.object({
    comentario: comentarioSchema,
    calificacion: calificacionSchema,
});
