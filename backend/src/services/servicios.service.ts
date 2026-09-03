import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Servicios } from "../models/Servicios";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarServicios(){
    try{
        const consulta = await pool.query("select * from servicios");
        return consulta.rows;
    }catch(error){
        errorThrower(error)
    }
}

export async function agregarServicio(serv: Servicios){
    try{
        const fecha = serv.fecha_creacion ?? new Date();
        const values = [serv.id_proveedor, serv.nombre, serv.descripcion, serv.precio_mensual, serv.estado, fecha]
        const consulta = "insert into servicios(id_proveedor, nombre, descripcion, precio_mensual, estado, fecha_creacion) values($1, $2, $3, $4, $5, $6) returning *"
        const resultado = await pool.query(consulta, values)
        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function buscarServicio(id: number){
    try{
        const resultado = await pool.query("select * from servicios where id_servicio = $1", [id])
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
        const consulta = "update servicios set id_proveedor=$1, nombre=$2, descripcion=$3, precio_mensual=$4, estado=$5, fecha_creacion=$6 where id_servicio=$7 returning *"
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
        const consulta = await pool.query("delete from servicios where id_servicio = $1", [id]);
        if(consulta.rowCount === 0){
            throw new NotFoundError("no se pudo eliminar el servicio porque el id no existe")
        }
        return true
    }catch(error){
        errorThrower(error)
    }
}