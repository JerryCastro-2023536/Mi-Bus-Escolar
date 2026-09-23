import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Asistencias } from "../models/asistencias";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarAsistencias() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_asistencias_obtener()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarAsistenciaById(id: number) {
    try {
        const res = await pool.query("SELECT * FROM sp_asistencias_buscar($1)", [id]);

        if (!res.rows[0]) {
            throw new NotFoundError(`La asistencia con ID ${id} no fue encontrada.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarAsistencia(a: Asistencias) {
    try {
        const values = [a.id_viaje, a.id_estudiante, a.estado_abordaje, a.hora_abordaje, a.estado_descenso, a.hora_descenso];
        const query = "SELECT * FROM sp_asistencias_crear($1, $2, $3, $4, $5, $6)";
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarAsistenciaById(id: number, a: Asistencias) {
    try {
        const values = [id, a.id_viaje, a.id_estudiante, a.estado_abordaje, a.hora_abordaje, a.estado_descenso, a.hora_descenso];
        const query = "SELECT * FROM sp_asistencias_editar($1, $2, $3, $4, $5, $6, $7)";
        const res = await pool.query(query, values);

        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: La asistencia con ID ${id} no existe.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarAsistenciaById(id: number) {
    try {
        const res = await pool.query("SELECT sp_asistencias_eliminar($1) AS eliminado", [id]);

        if (!res.rows[0].eliminado) {
            throw new NotFoundError(`No se puede eliminar: La asistencia con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}
