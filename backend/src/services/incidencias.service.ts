import e from "cors";
import { pool } from "../config/conexion";
import { Incidencias } from "../models/Incidencias";
import { errorThrower } from "../utils/middleware/errorThrower";
import { NotFoundError } from "../errors/notFound.error";

export async function listarIncidencias(){
    try{
        const consulta = await pool.query("select * from incidencias");
        return consulta.rows;
    }catch(error){
        errorThrower(error)
    }
}

export async function agregarIncidencia(inc: Incidencias){
    try{
        const consulta = "insert into incidencias(id_viaje, id_ruta, id_usuario_reporta, titulo, descripcion, latitud, longitud, fecha_hora, estado) values($1, $2, $3, $4, $5, $6, $7, $8, $9)"
        const values = [inc.id_viaje, inc.id_ruta, inc.id_usuario_reporta, inc.titulo, inc.descripcion, inc.latitud, inc.longitud, inc.fecha_hora, inc.estado]
        const resultado = await pool.query(consulta, values)
        return resultado.rows[0]
    }catch(error){
        errorThrower(error)
    }
}

export async function buscarIncidencia(id: number){
    try{
        const resultado = await pool.query("select * from incidencias where id_incidencia = $1", [id])
        if(!resultado.rows[0]){
            throw new NotFoundError(`la incidencia con el id ${id} no se encontro`)
        }

        return resultado.rows[0]
    }catch(error){
        errorThrower(error)
    }
    
}

export async function actualizarIncidencia(id: number, inc: Incidencias){
    try{
        const values = [inc.id_viaje, inc.id_ruta, inc.id_usuario_reporta, inc.titulo, inc.descripcion, inc.latitud, inc.longitud, inc.fecha_hora, inc.estado, id]
        const consulta = "update incidencias set id_viaje=$1, id_ruta=$2, id_usuario_reporta=$3, titulo=$4, descripcion=$5, latitud=$6, longitud=$7, fecha_hora=$8, estado=$9 where id_incidencia=$10"
        const resultado = await pool.query(consulta, values)
        
        if(!resultado.rows[0]){
            throw new NotFoundError("no se pudo editar ya que la incidencia porque el id no existe")
        }

        return resultado.rows[0]
    }catch(error){
        errorThrower(error)
    }

}

export async function eliminarIncidencia(id: number){
    try{
        const consulta = await pool.query("delete from incidencias where id_incidencia = $1", [id]);
        if(consulta.rowCount === 0){
            throw new NotFoundError("no se pudo eliminar la incidencia porque el id no existe")
        }

        return true
    }catch(error){
        errorThrower(error)
    }
}