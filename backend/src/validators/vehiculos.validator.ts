import {z} from "zod"

const EstadoActivoInactivo = z.enum(["activo", "inactivo"], {
    error:(issue) => {
        if(issue === undefined){
            return `el estado es obligatorio`
        }

        return "el estado debe de ser 'activo' o 'inactivo'"
    }
})

const requiredString = (field: String) =>
    z.string({
        error: (issue) =>{
            if(issue === undefined){
                return `el ${field} es obligatorio `
            }

            return `el ${field} debe de ser texto`
        }
})

    const vehiculosSchema = z.object({
    id_vehiculo: z.number()
        .int("el id del vehiculo tiene que ser un numero entero")
        .positive("el id tiene que ser un numero positivo")
        .optional(),

    id_proveedor: z.number()
        .int("el id del proveedor tiene que ser un numero entero")
        .positive("el id tiene que ser un numero positivo"),

    placa: requiredString("placa")
        .trim()
        .min(1, "la placa no puede estar vacia")
        .max(20, "la placa no puede exceder los 20 caracteres")
        .regex(
            /^[A-Z0-9-]+$/i,
            "la placa solo puede contener letras, numeros y guiones"
        ),

    foto_vehiculo: z.string({
        error: (issue) => {
            if (issue === undefined) {
                return undefined;
            }
            return "la foto del vehiculo debe de ser texto";
        }
    })
        .url("la foto del vehiculo debe ser una URL valida")
        .nullable()
        .optional(),

    estado: EstadoActivoInactivo,
});

export const createVehiculoSchema = vehiculosSchema.omit({
    id_vehiculo: true,
});

export const updateVehiculoSchema = createVehiculoSchema;