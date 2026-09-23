import { z } from "zod";
import { zUtils } from "../utils/zodHelpers";

const colegioSchema = z.object({
    id_colegio: z.number()
        .int("El ID del colegio debe ser un número entero")
        .positive("El ID del colegio debe ser positivo")
        .optional(),

    nombre: zUtils.requiredString("nombre")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(200, "El nombre no puede exceder los 200 caracteres"),

    direccion: zUtils.optionalString("dirección")
        .refine(
            (valor) => valor === null || valor === undefined || valor.trim().length >= 5,
            "La dirección debe tener al menos 5 caracteres"
        )
        .refine(
            (valor) => valor === null || valor === undefined || valor.length <= 255,
            "La dirección no puede exceder los 255 caracteres"
        ),

    telefono_contacto: zUtils.optionalString("teléfono de contacto")
        .refine(
            (valor) =>
                valor === null ||
                valor === undefined ||
                /^\+?[0-9]+$/.test(valor),
            "El teléfono solo debe contener números y opcionalmente un '+' al inicio"
        )
        .refine(
            (valor) =>
                valor === null ||
                valor === undefined ||
                (valor.length >= 8 && valor.length <= 20),
            "El teléfono debe tener entre 8 y 20 caracteres"
        ),
});

export const createColegioSchema = colegioSchema.omit({
    id_colegio: true,
});

export const updateColegioSchema = createColegioSchema;