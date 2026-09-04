import { pool } from "../config/Conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Asignaciones_Ruta } from "../models/Asignaciones_Rutas";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarAsignacionesRutas() {
    try {
        const resultado = await pool.query("SELECT * FROM asignaciones_ruta");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarAsignacionesRutas(p_asignacion_ruta : Asignaciones_Ruta){
    try {
        const valores = [p_asignacion_ruta.id_estudiante, p_asignacion_ruta.id_ruta, p_asignacion_ruta.id_parada_recogida, p_asignacion_ruta.id_parada_descenso];
        const consulta = `INSERT INTO asignaciones_ruta(id_estudiante, id_ruta, id_parada_recogida, id_parada_descenso) VALUES ($1, $2, $3, $4)`
        const resultado = await pool.query(consulta, valores);
        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarAsignacionRutaPorId(id : number){
    try {
        const valor = [id];
        const resultado = await pool.query("SELECT * FROM asignaciones_ruta WHERE id_asignacion = $1", valor);
        if (!resultado.rows[0]) {
            throw new NotFoundError(`La asignación con ID ${id} no fue encontrada.`);
        }
        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function actualizarAsignacionRuta(p_asignacion_ruta : Asignaciones_Ruta, id: number){
    try {
        const valores = [p_asignacion_ruta.id_estudiante, p_asignacion_ruta.id_ruta, p_asignacion_ruta.id_parada_recogida, p_asignacion_ruta.id_parada_descenso, id];
        const consulta = `UPDATE asignaciones_ruta SET id_estudiante = $1, id_ruta = $2, id_parada_recogida = $3, id_parada_descenso = $4 WHERE id_asignacion = $5`;
        const resultado = await pool.query(consulta, valores);
        if (!resultado.rows[0]) {
            throw new NotFoundError(`La asignación con ID ${id} no fue encontrada.`);
        }
        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarAsignacionRuta(id : number) {
    try {
        const valor = [id];
        const resultado = await pool.query("DELETE FROM asignaciones_ruta WHERE id_asignacion = $1", valor);
        if (resultado.rowCount === 0) {
            throw new NotFoundError(`La asignación con ID ${id} no fue encontrada.`);
        }
        return true;
    } catch (error) {
        errorThrower(error);
    }
}
