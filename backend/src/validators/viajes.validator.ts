import { z } from "zod";

const nullableNumber = (field: string) =>
    z.number({
        error: (issue) => {
            if (issue.input === undefined) {
                return `El ${field} es obligatorio (puede ser null, pero debe enviarse)`;
            }
            return `El ${field} debe ser un número`;
        },
    })
    .int(`El ${field} debe ser un número entero`)
    .positive(`El ${field} debe ser positivo`)
    .nullable();

const requiredDate = (field: string) =>
    z.coerce.date({
        error: (issue) => {
            if (issue.input === undefined) {
                return `La ${field} es obligatoria`;
            }
            return `La ${field} debe ser una fecha válida`;
        },
    });

const timeString = (field: string) =>
    z.string({
        error: (issue) => {
            if (issue.input === undefined) return undefined;
            return `La ${field} debe ser un texto en formato HH:mm o HH:mm:ss`;
        },
    })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, `La ${field} debe tener el formato HH:mm o HH:mm:ss`)
    .nullable()
    .optional();


const estadoViajesEnum = z.enum(
    ["PROGRAMADO", "ACTIVO", "FINALIZADO"],
    {
        error: (issue) => {
            if (issue.input === undefined) {
                return "El estado es obligatorio";
            }
            return "El estado ingresado no es válido";
        },
    }
);

const viajeSchema = z.object({
    id_viaje: z.number()
        .int("El ID de viaje debe ser un número entero")
        .positive("El ID de viaje debe ser positivo")
        .optional(),

    id_ruta: nullableNumber("ID de ruta"),
    id_chofer: nullableNumber("ID de chofer"),
    id_vehiculo: nullableNumber("ID de vehículo"),

    fecha_viaje: requiredDate("Fecha del viaje"),

    hora_inicio: timeString("Hora de inicio"),
    hora_fin: timeString("Hora de fin"),

    estado: estadoViajesEnum.default("PROGRAMADO"),
})
.refine((data) => {
    if (data.hora_inicio && data.hora_fin) {
        return data.hora_fin > data.hora_inicio;
    }
    return true;
}, {
    message: "La hora de finalización debe ser posterior a la hora de inicio",
    path: ["hora_fin"]
})
.refine((data) => {
    if (data.estado === "ACTIVO") {
        return data.hora_inicio !== null && data.hora_inicio !== undefined;
    }
    return true;
}, {
    message: "Un viaje ACTIVO debe tener una hora de inicio registrada",
    path: ["hora_inicio"]
})
.refine((data) => {
    if (data.estado === "FINALIZADO") {
        return (
            data.hora_inicio !== null && data.hora_inicio !== undefined &&
            data.hora_fin !== null && data.hora_fin !== undefined
        );
    }
    return true;
}, {
    message: "Un viaje FINALIZADO debe tener hora de inicio y de fin",
    path: ["estado"]
});

export const createViajeSchema = viajeSchema.omit({
    id_viaje: true,
});

export const updateViajeSchema = createViajeSchema;