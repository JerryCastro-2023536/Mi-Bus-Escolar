import { z } from 'zod';
import { zUtils } from '../utils/zodHelpers';

const proveedorSchema = z.object({
    id_proveedor: zUtils.optionalPositiveInt("id_proveedor"),

    id_usuario: zUtils.requiredPositiveInt("id_usuario"),

    nombre_negocio: zUtils.requiredString("nombre_negocio")
        .trim()
        .min(1, "El campo 'nombre_negocio' no puede estar vacío")
        .max(150, "El campo 'nombre_negocio' no puede tener más de 150 caracteres"),

    direccion: zUtils.optionalString("direccion")
        .transform((val) => (val === "" ? null : val)),

    telefono_contacto: zUtils.requiredString("telefono_contacto")
        .min(8, "El teléfono de contacto debe tener al menos 8 caracteres")
        .max(20, "El teléfono de contacto no puede tener más de 20 caracteres")
        .regex(/^\+?[0-9]+$/, "El teléfono solo debe contener números y opcionalmente el '+' al inicio"),
});

export const createProveedorSchema = proveedorSchema.omit({
    id_proveedor: true
});

export const updateProveedorSchema = createProveedorSchema;