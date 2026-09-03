import { z } from "zod";
import { zUtils } from "../utils/zodHelpers";

const userSchema = z.object({
    id_usuario: zUtils.optionalPositiveInt("ID de usuario"),

    nombre: zUtils.requiredString("nombre")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder los 100 caracteres"),

    apellido: zUtils.requiredString("apellido")
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(100, "El apellido no puede exceder los 100 caracteres"),

    correo: zUtils.requiredString("correo")
        .email("Debe ser un correo electrónico válido")
        .max(150, "El correo no puede exceder los 150 caracteres"),

    password: zUtils.requiredString("contraseña")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(255, "La contraseña no puede exceder los 255 caracteres")
        .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
        .regex(/[0-9]/, "La contraseña debe contener al menos un número"),

    telefono: zUtils.requiredString("teléfono")
        .min(8, "El teléfono debe tener al menos 8 caracteres")
        .max(20, "El teléfono no puede exceder los 20 caracteres")
        .regex(/^\+?[0-9]+$/, "El teléfono solo debe contener números y opcionalmente un '+' al inicio"),

    foto_usuario: z.union([zUtils.optionalString("foto de usuario"), z.url("La foto debe ser una URL válida")]),

    rol: zUtils.requiredEnum("rol", ["ADMINISTRADOR", "PROVEEDOR", "CHOFER", "USUARIO"]),

    correo_verificado: zUtils.requiredBoolean("correo verificado").default(false),

    fecha_creacion: z.date().optional(),
    
    fecha_actualizacion: z.date().optional()
});

export const createUserSchema = userSchema.omit({
    id_usuario: true,
    fecha_creacion: true,
    fecha_actualizacion: true
});

export const loginUserSchema = userSchema.omit({
    id_usuario: true,
    fecha_creacion: true,
    fecha_actualizacion: true,
    nombre: true,
    apellido: true,
    telefono: true,
    foto_usuario: true,
    rol: true,
    correo_verificado: true
})

export const updateUserSchema = createUserSchema;