import { z } from "zod";

const requiredString = (field: string) =>
    z.string({
        error: (issue) => {
            if (issue.input === undefined) {
                return `El ${field} es obligatorio`;
            }

            return `El ${field} debe ser un texto`;
        },
    });

const userRolEnum = z.enum(
    ["ADMINISTRADOR", "PROVEEDOR", "CHOFER", "USUARIO"],
    {
        error: (issue) => {
            if (issue.input === undefined) {
                return "El rol es obligatorio";
            }

            return "El rol ingresado no es válido";
        },
    }
);

export const userSchema = z.object({
    id_usuario: z.number()
        .int("El ID de usuario debe ser un número entero")
        .positive("El ID de usuario debe ser positivo")
        .optional(),

    nombre: requiredString("nombre")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder los 100 caracteres"),

    apellido: requiredString("apellido")
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(100, "El apellido no puede exceder los 100 caracteres"),

    correo: requiredString("correo")
        .email("Debe ser un correo electrónico válido")
        .max(150, "El correo no puede exceder los 150 caracteres"),

    password: requiredString("contraseña")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(255, "La contraseña no puede exceder los 255 caracteres")
        .regex(
            /[A-Z]/,
            "La contraseña debe contener al menos una letra mayúscula"
        )
        .regex(
            /[0-9]/,
            "La contraseña debe contener al menos un número"
        ),

    telefono: requiredString("teléfono")
        .min(8, "El teléfono debe tener al menos 8 caracteres")
        .max(20, "El teléfono no puede exceder los 20 caracteres")
        .regex(
            /^\+?[0-9]+$/,
            "El teléfono solo debe contener números y opcionalmente un '+' al inicio"
        ),

    foto_usuario: z.string({
        error: (issue) => {
            if (issue.input === undefined) {
                return undefined;
            }

            return "La foto debe ser un texto";
        },
    })
        .url("La foto debe ser una URL válida")
        .nullable()
        .optional(),

    rol: userRolEnum,

    correo_verificado: z.boolean().default(false),

    fecha_creacion: z.date().optional(),

    fecha_actualizacion: z.date().optional(),
});