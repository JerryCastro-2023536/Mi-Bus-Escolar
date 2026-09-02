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

const optionalString = (field: string, maxLength: number) =>
    z.string({
        error: (issue) => {
            if (issue === undefined) {
                return undefined;
            }
            return `el ${field} debe de ser texto`;
        }
    })
    .trim()
    .max(maxLength, `el ${field} no puede tener mas de ${maxLength} caracteres`)
    .nullable()
    .optional()
    .transform((val) => (val === "" ? null : val));

const requiredDecimal = (field: string, maxValue: number) =>
    z.number({
        error: (issue) => {
            if (issue === undefined) {
                return `el ${field} es obligatorio`;
            }
            return `el ${field} debe de ser un numero`;
        }
    })
        .positive(`el ${field} debe ser mayor a 0`)
        .max(maxValue, `el ${field} no puede exceder ${maxValue}`);

const serviciosSchema = z.object({
    id_servicio: z.number()
        .int("el id del servicio tiene que ser un numero entero")
        .positive("el id tiene que ser un numero positivo")
        .optional(),

    id_proveedor: z.number()
        .int("el id del proveedor tiene que ser un numero entero")
        .positive("el id tiene que ser un numero positivo"),

    nombre: requiredString("nombre")
        .trim()
        .min(1, "el nombre del servicio no puede estar vacio")
        .max(150, "el nombre del servicio no puede exceder los 150"),

    descripcion: optionalString("descripcion", 255),

    precio_mensual: requiredDecimal("precio mensual", 9999),

    estado: EstadoActivoInactivo,

    fecha_creacion: z.string()
        .datetime({ message: "la fecha de creacion debe ser una fecha ISO 8601 valida" })
        .optional(),
});

export const createServicioSchema = serviciosSchema.omit({
    id_servicio: true,
    fecha_creacion: true,
});

export const updateServicioSchema = createServicioSchema;