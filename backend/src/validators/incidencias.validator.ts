import {union, z, ZodObject} from 'zod';


const requiredString = (field: String) =>
    z.string({
        error: (issue) =>{
            if(issue === undefined){
                return `el ${field} es obligatorio `
            }

            return `el ${field} debe de ser texto`
        }
    })

const incidenciaEstadoAbiertoCerrado = z.enum(["abierto", "cerrado"], {
    error: (issue) => {
        if(issue === undefined){
            return "el estado es obligatorio"
        }
        
        return "el estado debe de ser 'abierto' o 'cerrado'"
    }   
})

const incidenciaSchema = z.object({
    id_incidencia: z.number()
    .int("el id de la inciencia tiene que ser un numero entero")
    .positive("el id tiene que ser positivo")
    .optional(),

    id_viaje: z.number()
        .int("el id del viaje tiene que ser un numero entero")
        .positive("el id del viaje tiene que ser un numero positivo")
        .nullable(),

    id_ruta: z.number()
    .int("el id del viaje tiene que ser un numero entero")
    .positive("el id del viaje tiene que ser un numero positivo")
    .nullable(),

    id_usuario_reporta: z.number()
    .int("el id del usuario tiene que ser un numero entero")
    .positive("el id del usuario tiene que ser un numero positivo")
    .nullable(),

    titulo: requiredString("titulo").trim().min(1, "el titulo es obligatorio").max(100, "el titulo no puede tener mas de 100 caracteres"),

    descripcion: requiredString("descripcion").trim().min(1, "la descripcion es obligatoria").max(500, "la descripcion no puede tener mas de 500 caracteres"),

    latitud: z.number().min(-90, "la latitud no puede ser menor a -90").max(90, "la latitud no puede ser mayor a 90"),

    longitud: z.number().min(-180, "la longitud no puede ser menor a -180").max(180, "la longitud no puede ser mayor a 180"),

    fecha_hora: union([z.string().datetime({message: "la fecha y hora debe de ser un string con formato ISO 8601"}), z.coerce.date("la fecha y hora debe de ser una fecha válida").optional()]),

    estado: incidenciaEstadoAbiertoCerrado

})

export const createIncidenciaSchema = incidenciaSchema.omit({id_viaje: true, id_ruta: true, id_usuario_reporta: true}) 

export const updateIncidenciaSchema = createIncidenciaSchema