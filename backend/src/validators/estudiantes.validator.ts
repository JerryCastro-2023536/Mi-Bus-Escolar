import { z } from "zod";
import { zUtils } from "../utils/zodHelpers";

const estudianteSchema = z.object({
    id_estudiante: z.number()
        .int("El ID del estudiante debe ser un número entero")
        .positive("El ID del estudiante debe ser positivo")
        .optional(),

    id_usuario_tutor: zUtils.requiredPositiveInt("ID del usuario tutor"),   

    id_colegio: z.number({
        error: (issue) => {
            if (issue.input === undefined) {
                return undefined;
            }

            return "El ID del colegio debe ser un número";
        },
    })
        .int("El ID del colegio debe ser un número entero")
        .positive("El ID del colegio debe ser positivo")
        .nullable()
        .optional(),

    nombre: zUtils.requiredString("nombre")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder los 100 caracteres"),

    apellido: zUtils.requiredString("apellido")
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(100, "El apellido no puede exceder los 100 caracteres"),

    fecha_nacimiento: z.coerce.date({
        error: (issue) => {
            if (issue.input === undefined) {
                return "La fecha de nacimiento es obligatoria";
            }

            return "La fecha de nacimiento no es válida";
        },
    }),

    foto_estudiante: z.string({
        error: (issue) => {
            if (issue.input === undefined) {
                return undefined;
            }

            return "La foto del estudiante debe ser un texto";
        },
    })
        .nullable()
        .optional(),

    grado: zUtils.optionalString("grado")
        .refine(
            (valor) =>
                valor === null ||
                valor === undefined ||
                valor.trim().length >= 1,
            "El grado no puede estar vacío"
        )
        .refine(
            (valor) =>
                valor === null ||
                valor === undefined ||
                valor.length <= 50,
            "El grado no puede exceder los 50 caracteres"
        ),
});

export const createEstudianteSchema = estudianteSchema.omit({
    id_estudiante: true,
});

export const updateEstudianteSchema = createEstudianteSchema;