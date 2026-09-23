import { zUtils } from './../utils/zodHelpers';
import { z } from "zod";

const baseUbicacionSchema = z.object({
    id_ubicacion: zUtils.optionalPositiveInt("ID de ubicación"),
    id_viaje: zUtils.requiredPositiveInt("ID de viaje"),

    latitud: zUtils.requiredNumber("latitud")
        .min(-90, "La latitud mínima es -90 grados")
        .max(90, "La latitud máxima es 90 grados"),

    longitud: zUtils.requiredNumber("longitud")
        .min(-180, "La longitud mínima es -180 grados")
        .max(180, "La longitud máxima es 180 grados"),

    velocidad: z.union([z.number().nonnegative(), zUtils.optionalNumber("velocidad")]) ,

    fecha_hora: zUtils.requiredDate("fecha y hora").nullable().optional(),
});

export const createUbicacionSchema = baseUbicacionSchema.omit({
    id_ubicacion: true,
});

export const updateUbicacionSchema = createUbicacionSchema;
