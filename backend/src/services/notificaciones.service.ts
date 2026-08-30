import { pool } from "../config/Conexion";
import { Notificaciones } from "../models/Notificaciones";

export async function listarNotificaciones() {
    const resultado = await pool.query("SELECT * FROM notificaciones");
    return resultado.rows;
}

export async function agregarNotificaciones(p_notificaciones : Notificaciones){
    const valores = [p_notificaciones.id_usuario, p_notificaciones.id_incidencia, p_notificaciones.id_asistencia, p_notificaciones.tipo, p_notificaciones.titulo, p_notificaciones.mensaje, p_notificaciones.leida, p_notificaciones.fecha_envio];
    const consulta = `INSERT INTO notificaciones(id_usuario, id_incidencia, id_asistencia, tipo, titulo, mensaje, leida, fecha_envio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function buscarNotificacionPorId(id : number){
    const valor = [id];
    const resultado = await pool.query("SELECT * FROM notificaciones WHERE id_notificaciones = $1", valor);
    return resultado.rows[0];
}

export async function actualizarNotificacion(p_notificaciones : Notificaciones, id: number){
    const valores = [p_notificaciones.id_usuario, p_notificaciones.id_incidencia, p_notificaciones.id_asistencia, p_notificaciones.tipo, p_notificaciones.titulo, p_notificaciones.mensaje, p_notificaciones.leida, p_notificaciones.fecha_envio, id];
    const consulta = `UPDATE notificaciones SET id_usuario = $1, id_incidencia = $2, id_asistencia = $3, tipo = $4, titulo = $5, mensaje = $6, leida = $7, fecha_envio = $8 WHERE id_notificaciones = $9`;
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function eliminarNotificacion(id : number) {
    const valor = [id];
    const resultado = await pool.query("DELETE FROM notificaciones WHERE id_notificaciones = $1", valor);
    console.log("Eliminado correctamente");
}
