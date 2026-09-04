import { z } from "zod";
import { zUtils } from "../utils/zodHelpers";

const asistenciasSchema = z.object({
    id_asistencia: z.number()
        .int("El ID de asistencia debe ser un número entero")
        .positive("El ID de asistencia debe ser positivo")
        .optional(),

    id_viaje: zUtils.requiredPositiveInt("ID del viaje"),

    id_estudiante: zUtils.requiredPositiveInt("ID del estudiante"),

    estado_abordaje: zUtils.requiredEnum( "estado de abordaje", ["PENDIENTE", "PRESENTE", "AUSENTE"]),

    hora_abordaje: z.coerce.date({
        error: (issue) => {
            if (issue.input === undefined) {
                return undefined;
            }

            return "La hora de abordaje no es válida";
        },
    })
        .nullable()
        .optional(),

    estado_descenso: zUtils.optionalString("estado de descenso")
        .refine(
            (valor) =>
                valor === null ||
                valor === undefined ||
                valor.trim().length >= 1,
            "El estado de descenso no puede estar vacío"
        )
        .refine(
            (valor) =>
                valor === null ||
                valor === undefined ||
                valor.length <= 20,
            "El estado de descenso no puede exceder los 20 caracteres"
        ),

    hora_descenso: z.coerce.date({
        error: (issue) => {
            if (issue.input === undefined) {
                return undefined;
            }

            return "La hora de descenso no es válida";
        },
    })
        .nullable()
        .optional(),
});

export const createAsistenciaSchema = asistenciasSchema.omit({
    id_asistencia: true,
});

export const updateAsistenciaSchema = createAsistenciaSchema;