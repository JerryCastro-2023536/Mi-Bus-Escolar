import {z} from "zod"

const EstadoActivoInactivo = z.enum(["ACTIVO", "INACTIVO"], {
    error:(issue) => {
        if(issue === undefined){
            return `el estado es obligatorio`
        }

        return "el estado debe de ser 'ACTIVO' o 'INACTIVO'"
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

const rutasSchema = z.object({
    id_ruta: z.number()
    .int("el id de la ruta tiene que ser un numero entero")
    .positive("el id tiene que ser un numero positivo")
    .optional(),

    id_servicio: z.number()
    .int("el id del servicio tiene que ser un numero entero")
    .positive("el id tiene que ser un numero positivo"),

    id_vehiculos: z.number()
    .int("el id de vehiculos tiene que ser un numero entero")
    .positive("el id tiene que ser un numero positivo")
    .nullable()
    .optional(),

    id_chofer: z.number()
    .int("el id del chofer debe ser un numero entero")
    .positive("el id del chofer tiene que ser positivo")
    .nullable()
    .optional(),

    nombre: requiredString("nombre")
    .trim()
    .min(1, "el nombre de la ruta no puede estar vacio")
    .max(150, "el nopmbre de la ruta no puede exceder los 150"),

    hora_inicia_estimada: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,"La hora de inicio debe tener formato HH:MM o HH:MM:SS")
    .nullable()
    .optional(),

    hora_fin_estimada: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,"La hora de inicio debe tener formato HH:MM o HH:MM:SS")
    .nullable()
    .optional(),

    estado: EstadoActivoInactivo
    
})

export const createRutaSchema = rutasSchema.omit({
    id_ruta: true
})

export const updateSchema = createRutaSchema