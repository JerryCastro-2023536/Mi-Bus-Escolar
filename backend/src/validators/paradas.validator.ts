import z from "zod";
import { zUtils } from "../utils/zodHelpers";

export const paradaSchema = z.object({
    id_parada: zUtils.optionalPositiveInt("ID de parada"),

    nombre: zUtils.requiredString("nombre")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre no puede exceder de 50 caracteres"),

    direccion: zUtils.requiredString("direccion")
        .min(3, "La direccion debe tener al menos 3 caracteres"),

    latitud: zUtils.requiredNumber("latitud")
        .min(-90, "La coordenada es menor a una existente")
        .max(90, "La coordenada es mayor a una existente"),

    longitud: zUtils.requiredNumber("longitud")
        .min(-180, "La longitud es menor a una existente")
        .max(180, "La longitud es mayor a una existente")
});

export const createParadaSchema = paradaSchema.omit({
    id_parada: true
});

export const updateParadaSchema = createParadaSchema;

