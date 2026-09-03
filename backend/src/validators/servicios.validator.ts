import { z } from "zod";
import { zUtils } from "../utils/zodHelpers";

const serviciosSchema = z.object({
    id_servicio: zUtils.optionalPositiveInt("id_servicio"),

    id_proveedor: zUtils.requiredPositiveInt("id_proveedor"),

    nombre: zUtils.requiredString("nombre")
        .trim()
        .min(1, "El nombre del servicio no puede estar vacío")
        .max(150, "El nombre del servicio no puede exceder los 150 caracteres"),

    descripcion: zUtils.optionalString("descripcion")
        .transform((val) => (val === "" ? null : val)),

    precio_mensual: zUtils.requiredNumber("precio_mensual")
        .positive("El precio mensual debe ser mayor a 0")
        .max(9999, "El precio mensual no puede exceder los 9999"),

    estado: zUtils.requiredEnum("estado", ["ACTIVO", "INACTIVO"]),

    fecha_creacion: zUtils.requiredDate("fecha_creacion").optional()
});

export const createServicioSchema = serviciosSchema.omit({
    id_servicio: true
});

export const updateServicioSchema = createServicioSchema;