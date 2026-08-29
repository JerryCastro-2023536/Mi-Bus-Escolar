import { pool } from "../config/conexion";
import { Incidencias } from "../models/Incidencias";

export async function listarIncidencias(){
    const consulta = await pool.query("select * from incidencias");
    return consulta.rows;
}

export async function agregarIncidencia(inc: Incidencias){
    const values = [inc.id_viaje, inc.id_ruta, inc.id_usuario_reporta, inc.titulo, inc.descripcion, inc.latitud, inc.longitud, inc.fecha_hora, inc.estado]
    const consulta = "insert into incidencias(id_viaje, id_ruta, id_usuario_reporta, titulo, descripcion, latitud, longitud, fecha_hora, estado) values($1, $2, $3, $4, $5, $6, $7, $8, $9)"
    const resultado = await pool.query(consulta, values)
    return resultado.rows[0];
}

export async function buscarIncidencia(id: number){
    const resultado = await pool.query("select * from incidencias where id_incidencia = $1", [id])
    return resultado.rows[0]
}

export async function actualizarIncidencia(id: number, inc: Incidencias){
    const values = [inc.id_viaje, inc.id_ruta, inc.id_usuario_reporta, inc.titulo, inc.descripcion, inc.latitud, inc.longitud, inc.fecha_hora, inc.estado, id]
    const consulta = "update incidencias set id_viaje=$1, id_ruta=$2, id_usuario_reporta=$3, titulo=$4, descripcion=$5, latitud=$6, longitud=$7, fecha_hora=$8, estado=$9 where id_incidencia=$10"
    const resultado = await pool.query(consulta, values)
    return resultado.rows[0];
}

export async function eliminarIncidencia(id: number){
    const consulta = await pool.query("delete from incidencias where id_incidencia = $1", [id]);
    console.log("se ha eliminado la incidencia correctamente")
    return (consulta.rowCount ?? 0 ) >0
}