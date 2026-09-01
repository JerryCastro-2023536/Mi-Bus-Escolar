import { pool } from "../config/conexion";
import { Estudiantes } from "../models/estudiantes";

export async function listarEstudiantes() {
    const resultado = await pool.query("SELECT * FROM estudiantes");
    return resultado.rows;
}

export async function agregarEstudiantes(p_estudiantes: Estudiantes) {
    const valores = [
        p_estudiantes.id_usuario_tutor,
        p_estudiantes.id_colegio,
        p_estudiantes.nombre,
        p_estudiantes.apellido,
        p_estudiantes.fecha_nacimiento,
        p_estudiantes.foto_estudiante,
        p_estudiantes.grado
    ];

    const consulta = `
        INSERT INTO estudiantes(
            id_usuario_tutor,
            id_colegio,
            nombre,
            apellido,
            fecha_nacimiento,
            foto_estudiante,
            grado
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;

    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function buscarEstudiantePorId(id: number) {
    const valor = [id];

    const resultado = await pool.query(
        "SELECT * FROM estudiantes WHERE id_estudiante = $1",
        valor
    );

    return resultado.rows[0];
}

export async function actualizarEstudiante(
    p_estudiantes: Estudiantes,
    id: number
) {
    const valores = [
        p_estudiantes.id_usuario_tutor,
        p_estudiantes.id_colegio,
        p_estudiantes.nombre,
        p_estudiantes.apellido,
        p_estudiantes.fecha_nacimiento,
        p_estudiantes.foto_estudiante,
        p_estudiantes.grado,
        id
    ];

    const consulta = `
        UPDATE estudiantes
        SET id_usuario_tutor = $1,
            id_colegio = $2,
            nombre = $3,
            apellido = $4,
            fecha_nacimiento = $5,
            foto_estudiante = $6,
            grado = $7
        WHERE id_estudiante = $8
        RETURNING *
    `;

    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function eliminarEstudiante(id: number) {
    const valor = [id];

    const resultado = await pool.query(
        "DELETE FROM estudiantes WHERE id_estudiante = $1",
        valor
    );

    console.log("Eliminado correctamente");
}
