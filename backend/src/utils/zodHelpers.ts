import { z } from "zod";

export const zUtils = {
    // String requerido
    requiredString: (field: string) =>
        z.string({
            error: (issue) => {
                if (issue.input === undefined)
                    return `El campo '${field}' es obligatorio`;
                return `El campo '${field}' debe ser un texto`;
            },
        }),

    // String opcional, solo valida si lo enviado es un texto
    optionalString: (field: string) =>
        z
            .string({
                error: (issue) => {
                    if (issue.input === undefined) return undefined;
                    return `El campo '${field}' debe ser un texto`;
                },
            })
            .nullable()
            .optional(),

    //Numero obligatorio: Positivo o int
    nullablePositiveInt: (field: string) =>
        z.number({
                error: (issue) => {
                    if (issue.input === undefined) {
                        return `El campo '${field}' es obligatorio (puede ser null, pero debe enviarse)`;
                    }
                    return `El campo '${field}' debe ser un número`;
                },
            })
            .int(`El campo '${field}' debe ser un número entero`)
            .positive(`El campo '${field}' debe ser positivo`)
            .nullable(),

    //Numero obligatorio: Positivo 
    requiredPositiveInt: (field: string) =>
        z.number({
                error: (issue) => {
                    if (issue.input === undefined)
                        return `El campo '${field}' es obligatorio`;
                    return `El campo '${field}' debe ser un número`;
                },
            })
            .int(`El campo '${field}' debe ser un número entero`)
            .positive(`El campo '${field}' debe ser positivo`),

    //IDs autogenerados
    optionalPositiveInt: (field: string) =>
        z.number({
            error: (issue) => {
                if (issue.input === undefined) return undefined;
                return `El campo '${field}' debe ser un número`;
            },
        })
        .int(`El campo '${field}' debe ser un número entero`)
        .positive(`El campo '${field}' debe ser positivo`)
        .optional(),

    //Fecha obligatoria
    requiredDate: (field: string) =>
        z.coerce.date({
            error: (issue) => {
                if (issue.input === undefined)
                    return `El campo '${field}' es obligatorio`;
                return `El campo '${field}' debe ser una fecha válida`;
            },
        }),
    
    //Tiempo opcional, pero con formato
    optionalTimeString: (field: string) =>
        z.string({
                error: (issue) => {
                    if (issue.input === undefined) return undefined;
                    return `El campo '${field}' debe ser un texto en formato HH:mm o HH:mm:ss`;
                },
            })
            .regex(
                /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/,
                `El campo '${field}' debe tener el formato HH:mm o HH:mm:ss`,
            )
            .nullable()
            .optional(),

    //Enum obligatorio
    requiredEnum: <T extends [string, ...string[]]>(field: string, values: T) =>
        z.enum(values, {
            error: (issue) => {
                if (issue.input === undefined)
                    return `El campo '${field}' es obligatorio`;
                return `El campo '${field}' no es válido. Opciones permitidas: ${values.join(", ")}`;
            },
        }),

    //Boolean obligatorio
    requiredBoolean: (field: string) =>
        z.boolean({
            error: (issue) => {
                if (issue.input === undefined)
                    return `El campo '${field}' es obligatorio`;
                return `El campo '${field}' debe ser verdadero o falso`;
            },
        }),
    
    // Número requerido (permite decimales, enteros, negativos o positivos)
    requiredNumber: (field: string) =>
        z.number({
            error: (issue) => {
                if (issue.input === undefined)
                    return `El campo '${field}' es obligatorio`;
                return `El campo '${field}' debe ser un número`;
            },
        }),

    // Número opcional, solo valida si lo enviado es un número
    optionalNumber: (field: string) =>
        z.number({
            error: (issue) => {
                if (issue.input === undefined) return undefined;
                return `El campo '${field}' debe ser un número`;
            },
        })
        .nullable()
        .optional(),
};
