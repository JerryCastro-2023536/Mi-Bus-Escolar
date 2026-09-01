import { pool } from "../config/conexion";
import { Asistencias } from "../models/asistencias";

export async function listarAsistencias() {
    const resultado = await pool.query("SELECT * FROM asistencias");
    return resultado.rows;
}

export async function agregarAsistencias(p_asistencias: Asistencias) {
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
}

export async function buscarAsistenciaPorId(id: number) {
    const valor = [id];

    const resultado = await pool.query(
        "SELECT * FROM asistencias WHERE id_asistencia = $1",
        valor
    );

    return resultado.rows[0];
}

export async function actualizarAsistencia(
    p_asistencias: Asistencias,
    id: number
) {
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
    return resultado.rows[0];
}

export async function eliminarAsistencia(id: number) {
    const valor = [id];

    const resultado = await pool.query(
        "DELETE FROM asistencias WHERE id_asistencia = $1",
        valor
    );

    console.log("Eliminado correctamente");
}