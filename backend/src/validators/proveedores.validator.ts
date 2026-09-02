import {z} from 'zod';

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

const proveedorSchema = z.object({
    id_proveedor: z.number().int("el id del proveedor tiene que ser un numero entero")
    .positive("el id del proveedor debe de ser positivo")
    .optional(),

    id_usuario: z.number().int("el id del usuario tiene que ser un numero entero")
    .positive("el id del usuario tiene que ser un numero positivo"),

    nombre_negocio: requiredString("nombre del negocio")
    .min(1, "el nombre del negocio no puede estar vacio")
    .max(150, "el nombre del negocio no puede tener mas de 150 caracteres"),

    direccion: optionalString("direccion", 255),

    telefono_contacto: z.string("el telefono de contacto debe de ser texto")
    .min(8, "el telefono debe de tener al menos 8 caracteres")
    .max(20, "el telefono de contacto no puede ser mas de 20 caracteres")
    .regex(/^\+?[0-9]+$/, "el telefono solo debe contener numeros y opcionalmente el '+' del inicio")

})

export const createProveedorSchema = proveedorSchema.omit({
    id_proveedor: true
})

export const updateProveedorSchema = createProveedorSchema