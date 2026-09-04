import { z } from "zod";
import { zUtils } from "../utils/zodHelpers";

const choferSchema = z.object({
    id_chofer: zUtils.optionalPositiveInt("ID del chofer"),

    id_usuario: zUtils.requiredPositiveInt("ID del usuario"),

    telefono_contacto: zUtils.requiredString("teléfono de contacto")
        .min(8, "El teléfono debe tener al menos 8 caracteres")
        .max(20, "El teléfono no puede exceder los 20 caracteres")
        .regex(
            /^\+?[0-9]+$/,
            "El teléfono solo debe contener números y opcionalmente un '+' al inicio"
        ),

    estado: zUtils.requiredEnum("estado", ["ACTIVO", "INACTIVO"]).default("ACTIVO"),
});

export const createChoferSchema = choferSchema.omit({
    id_chofer: true,
});

export const updateChoferSchema = createChoferSchema;