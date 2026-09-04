import { z } from "zod";
import { zUtils } from "../utils/zodHelpers";

const vehiculosSchema = z.object({
    id_vehiculo: zUtils.optionalPositiveInt("id_vehiculo"),

    id_proveedor: zUtils.requiredPositiveInt("id_proveedor"),

    placa: zUtils.requiredString("placa")
        .trim()
        .min(1, "La placa no puede estar vacía")
        .max(20, "La placa no puede exceder los 20 caracteres")
        .regex(
            /^[A-Z0-9-]+$/i,
            "La placa solo puede contener letras, números y guiones"
        ),

    foto_vehiculo: zUtils.optionalString("foto_vehiculo")
        .refine(
            (val) => !val || z.string().url().safeParse(val).success,
            { message: "La foto del vehículo debe ser una URL válida" }
        ),

    estado: zUtils.requiredEnum("estado", ["ACTIVO", "INACTIVO"])
});

export const createVehiculoSchema = vehiculosSchema.omit({
    id_vehiculo: true
});

export const updateVehiculoSchema = createVehiculoSchema;