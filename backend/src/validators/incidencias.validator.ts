import { z } from 'zod';
import { zUtils } from '../utils/zodHelpers';

const incidenciaSchema = z.object({
    id_incidencia: zUtils.optionalPositiveInt("id_incidencia"),

    id_viaje: zUtils.optionalPositiveInt("id_viaje").nullable(),

    id_ruta: zUtils.requiredPositiveInt("id_ruta"),

    id_usuario_reporta: zUtils.optionalPositiveInt("id_usuario_reporta").nullable(),

    titulo: zUtils.requiredString("titulo")
        .trim()
        .min(1, "El campo 'titulo' es obligatorio")
        .max(100, "El campo 'titulo' no puede tener mas de 100 caracteres"),

    descripcion: zUtils.optionalString("descripcion"),

    latitud: zUtils.optionalNumber("latitud")
        .refine(val => val === null || val === undefined || (val >= -90 && val <= 90), {
            message: "La latitud debe estar entre -90 y 90"
        }),

    longitud: zUtils.optionalNumber("longitud")
        .refine(val => val === null || val === undefined || (val >= -180 && val <= 180), {
            message: "La longitud debe estar entre -180 y 180"
        }),

    fecha_hora: zUtils.requiredDate("fecha_hora").optional(),

    estado: zUtils.requiredEnum("estado", ["ABIERTA", "CERRADA"])
});

export const createIncidenciaSchema = incidenciaSchema.omit({ id_incidencia: true });

export const updateIncidenciaSchema = createIncidenciaSchema;