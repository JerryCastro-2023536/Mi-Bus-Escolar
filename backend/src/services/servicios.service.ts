import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Servicios } from "../models/Servicios";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarServicios(){
    try{
        const consulta = await pool.query("select * from sp_servicios_listar()");
        return consulta.rows;
    }catch(error){
        errorThrower(error)
    }
}

export async function agregarServicio(serv: Servicios){
    try{
        const fecha = serv.fecha_creacion ?? new Date();
        const values = [serv.id_proveedor, serv.nombre, serv.descripcion, serv.precio_mensual, serv.estado, fecha]
        const consulta = "select * from sp_servicios_agregar($1, $2, $3, $4, $5, $6)"
        const resultado = await pool.query(consulta, values)
        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function buscarServicio(id: number){
    try{
        const resultado = await pool.query("select * from sp_servicios_buscar_por_id($1)", [id])
        if(!resultado.rows[0]){
            throw new NotFoundError(`el servicio con el id ${id} no se encontro`)
        }
        return resultado.rows[0]
    }catch(error){
        errorThrower(error)
    }
}

export async function actualizarServicio(id: number, serv: Servicios){
    try{
        const fecha = serv.fecha_creacion ?? new Date();
        const values = [serv.id_proveedor, serv.nombre, serv.descripcion, serv.precio_mensual, serv.estado, fecha, id]
        const consulta = "select * from sp_servicios_actualizar($1, $2, $3, $4, $5, $6, $7)"
        const resultado = await pool.query(consulta, values)

        if(!resultado.rows[0]){
            throw new NotFoundError("no se pudo editar el servicio porque el id no existe")
        }

        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function eliminarServicio(id: number){
    try{
        const consulta = await pool.query("select sp_servicios_eliminar($1) as filas_afectadas", [id]);
        if(consulta.rows[0].filas_afectadas === 0){
            throw new NotFoundError("no se pudo eliminar el servicio porque el id no existe")
        }
        return true
    }catch(error){
        errorThrower(error)
    }
}