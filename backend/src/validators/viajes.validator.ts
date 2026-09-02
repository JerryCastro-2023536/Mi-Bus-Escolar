import { z } from "zod"; 
import { zUtils } from "../utils/zodHelpers";

const viajeSchema = z.object({
    id_viaje: zUtils.optionalPositiveInt("ID de viaje"),

    id_ruta: zUtils.nullablePositiveInt("ID de ruta"),
    id_chofer: zUtils.nullablePositiveInt("ID de chofer"),
    id_vehiculo: zUtils.nullablePositiveInt("ID de vehículo"),

    fecha_viaje: zUtils.requiredDate("Fecha del viaje"),

    hora_inicio: zUtils.optionalTimeString("Hora de inicio"),
    hora_fin: zUtils.optionalTimeString("Hora de fin"),

    estado: zUtils.requiredEnum("estado", ["PROGRAMADO", "ACTIVO", "FINALIZADO"]).default("PROGRAMADO"),
})
.refine((data) => {
    if (data.hora_inicio && data.hora_fin) {
        return data.hora_fin > data.hora_inicio;
    }
    return true;
}, {
    message: "La hora de finalización debe ser posterior a la hora de inicio",
    path: ["hora_fin"]
})
.refine((data) => {
    if (data.estado === "ACTIVO") {
        return data.hora_inicio !== null && data.hora_inicio !== undefined;
    }
    return true;
}, {
    message: "Un viaje ACTIVO debe tener una hora de inicio registrada",
    path: ["hora_inicio"]
})
.refine((data) => {
    if (data.estado === "FINALIZADO") {
        return (
            data.hora_inicio !== null && data.hora_inicio !== undefined &&
            data.hora_fin !== null && data.hora_fin !== undefined
        );
    }
    return true;
}, {
    message: "Un viaje FINALIZADO debe tener hora de inicio y de fin",
    path: ["estado"]
});

export const createViajeSchema = viajeSchema.omit({
    id_viaje: true,
});

export const updateViajeSchema = createViajeSchema;