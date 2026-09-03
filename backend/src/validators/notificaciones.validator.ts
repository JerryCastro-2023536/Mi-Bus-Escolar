import z from "zod";
import { TipoNoti } from "../enums/TipoNoti";
import { zUtils } from "../utils/zodHelpers";

export const notificacionSchema = z.object({
	id_notificaciones: zUtils.optionalPositiveInt("ID de notificación"),

	id_usuario: zUtils.requiredPositiveInt("ID de usuario"),

	id_incidencia: zUtils.requiredPositiveInt("ID de incidencia"),

	id_asistencia: zUtils.requiredPositiveInt("ID de asistencia"),

	tipo: zUtils.requiredEnum("tipo", [
		TipoNoti.INCIDENTE,
		TipoNoti.ASISTENCIA,
		TipoNoti.INASISTENCIA,
		TipoNoti.OTRO
	]),

	titulo: zUtils.requiredString("titulo")
		.min(1, "El título no puede estar vacío")
        .max(12, "El numero de caracteres maximo es 12"),

	mensaje: zUtils.requiredString("mensaje")
		.min(1, "El mensaje no puede estar vacío"),

	leida: zUtils.requiredBoolean("leida"),

	fecha_envio: zUtils.requiredDate("fecha_envio")
});

export const createNotificacionSchema = notificacionSchema.omit({
	id_notificaciones: true,
    id_incidencia: true,
    id_asistencia: true
});

export const updateNotificacionSchema = createNotificacionSchema;
