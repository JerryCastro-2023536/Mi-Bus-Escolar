import { z } from "zod";
import { zUtils } from "../utils/zodHelpers";

const rutasSchema = z.object({
    id_ruta: zUtils.optionalPositiveInt("id_ruta"),

    id_servicio: zUtils.requiredPositiveInt("id_servicio"),

    id_vehiculo: zUtils.optionalPositiveInt("id_vehiculo").nullable(),

    id_chofer: zUtils.optionalPositiveInt("id_chofer").nullable(),

    nombre: zUtils.requiredString("nombre")
        .trim()
        .min(1, "El nombre de la ruta no puede estar vacío")
        .max(150, "El nombre de la ruta no puede exceder los 150 caracteres"),

    hora_inicio_estimada: zUtils.optionalTimeString("hora_inicio_estimada"),

    hora_fin_estimada: zUtils.optionalTimeString("hora_fin_estimada"),

    estado: zUtils.requiredEnum("estado", ["ACTIVO", "INACTIVO"])
});

export const createRutaSchema = rutasSchema.omit({
    id_ruta: true
});

export const updateSchema = createRutaSchema;