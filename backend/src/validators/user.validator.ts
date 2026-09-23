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

export const registerUserSchema = userSchema.omit({
    rol: true,
    correo_verificado: true,
})

// Login valida únicamente el formato necesario para autenticar.
// Las reglas de fortaleza (mayúscula, número, etc.) pertenecen al registro
// y al cambio de contraseña; aplicarlas aquí impediría iniciar sesión a
// usuarios históricos cuya contraseña válida fue creada con otra política.
export const loginUserSchema = z.object({
    correo: zUtils.requiredString("correo")
        .email("Debe ser un correo electrónico válido")
        .max(150, "El correo no puede exceder los 150 caracteres"),

    password: zUtils.requiredString("contraseña")
        .max(255, "La contraseña no puede exceder los 255 caracteres")
});

export const updateUserSchema = createUserSchema.extend({
    // En una edición normal de perfil la contraseña no debe ser obligatoria.
    // Los cambios de contraseña se validan en /usuarios/password/:id.
    password: userSchema.shape.password.optional()
});

export const cambiarPasswordSchema = z.object({
    oldPassword: zUtils.requiredString("contraseña actual"),
    
    newPassword: zUtils.requiredString("nueva contraseña")
        .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
        .max(255, "La nueva contraseña no puede exceder los 255 caracteres")
        .regex(/[A-Z]/, "La nueva contraseña debe contener al menos una letra mayúscula")
        .regex(/[0-9]/, "La nueva contraseña debe contener al menos un número"),
});