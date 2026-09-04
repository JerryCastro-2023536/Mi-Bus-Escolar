import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Asistencias } from "../models/asistencias";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarAsistencias() {
    try {
        const resultado = await pool.query("SELECT * FROM asistencias");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarAsistenciaPorId(id: number) {
    try {
        const resultado = await pool.query(
            "SELECT * FROM asistencias WHERE id_asistencia = $1",
            [id]
        );

        if (!resultado.rows[0]) {
            throw new NotFoundError(`La asistencia con ID ${id} no fue encontrada.`);
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarAsistencias(p_asistencias: Asistencias) {
    try {
        const valores = [
            p_asistencias.id_viaje,
            p_asistencias.id_estudiante,
            p_asistencias.estado_abordaje,
            p_asistencias.hora_abordaje,
            p_asistencias.estado_descenso,
            p_asistencias.hora_descenso
        ];

        const consulta = `
            INSERT INTO asistencias(
                id_viaje,
                id_estudiante,
                estado_abordaje,
                hora_abordaje,
                estado_descenso,
                hora_descenso
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const resultado = await pool.query(consulta, valores);
        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function actualizarAsistencia(p_asistencias: Asistencias, id: number) {
    try {
        const valores = [
            p_asistencias.id_viaje,
            p_asistencias.id_estudiante,
            p_asistencias.estado_abordaje,
            p_asistencias.hora_abordaje,
            p_asistencias.estado_descenso,
            p_asistencias.hora_descenso,
            id
        ];

        const consulta = `
            UPDATE asistencias
            SET id_viaje = $1,
                id_estudiante = $2,
                estado_abordaje = $3,
                hora_abordaje = $4,
                estado_descenso = $5,
                hora_descenso = $6
            WHERE id_asistencia = $7
            RETURNING *
        `;

        const resultado = await pool.query(consulta, valores);

        if (!resultado.rows[0]) {
            throw new NotFoundError(`No se puede editar: La asistencia con ID ${id} no existe.`);
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarAsistencia(id: number) {
    try {
        const resultado = await pool.query(
            "DELETE FROM asistencias WHERE id_asistencia = $1",
            [id]
        );

        if (resultado.rowCount === 0) {
            throw new NotFoundError(`No se puede eliminar: La asistencia con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}