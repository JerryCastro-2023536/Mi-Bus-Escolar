import { pool } from "../config/Conexion";
import { Asignaciones_Ruta } from "../models/Asignaciones_Rutas";

export async function listarAsignacionesRutas() {
    const resultado = await pool.query("SELECT * FROM asignaciones_ruta");
    return resultado.rows;
}

export async function agregarAsignacionesRutas(p_asignacion_ruta : Asignaciones_Ruta){
    const valores = [p_asignacion_ruta.id_estudiante, p_asignacion_ruta.id_ruta, p_asignacion_ruta.id_parada_recogida, p_asignacion_ruta.id_parada_descenso];
    const consulta = `INSERT INTO asignaciones_ruta(id_estudiante, id_ruta, id_parada_recogida, id_parada_descenso) VALUES ($1, $2, $3, $4)`
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function buscarAsignacionRutaPorId(id : number){
    const valor = [id];
    const resultado = await pool.query("SELECT * FROM asignaciones_ruta WHERE id_asignacion = $1", valor);
    return resultado.rows[0];
}

export async function actualizarAsignacionRuta(p_asignacion_ruta : Asignaciones_Ruta, id: number){
    const valores = [p_asignacion_ruta.id_estudiante, p_asignacion_ruta.id_ruta, p_asignacion_ruta.id_parada_recogida, p_asignacion_ruta.id_parada_descenso, id];
    const consulta = `UPDATE asignaciones_ruta SET id_estudiante = $1, id_ruta = $2, id_parada_recogida = $3, id_parada_descenso = $4 WHERE id_asignacion = $5`;
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function eliminarAsignacionRuta(id : number) {
    const valor = [id];
    const resultado = await pool.query("DELETE FROM asignaciones_ruta WHERE id_asignacion = $1", valor);
    console.log("Eliminado correctamente");
}
