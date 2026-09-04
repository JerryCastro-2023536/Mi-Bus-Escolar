import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Estudiantes } from "../models/estudiantes";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarEstudiantes() {
    try {
        const resultado = await pool.query("SELECT * FROM estudiantes");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarEstudiantePorId(id: number) {
    try {
        const resultado = await pool.query(
            "SELECT * FROM estudiantes WHERE id_estudiante = $1",
            [id]
        );

        if (!resultado.rows[0]) {
            throw new NotFoundError(`El estudiante con ID ${id} no fue encontrado.`);
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarEstudiantes(p_estudiantes: Estudiantes) {
    try {
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
    } catch (error) {
        errorThrower(error);
    }
}

export async function actualizarEstudiante(p_estudiantes: Estudiantes, id: number) {
    try {
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

        if (!resultado.rows[0]) {
            throw new NotFoundError(`No se puede editar: El estudiante con ID ${id} no existe.`);
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarEstudiante(id: number) {
    try {
        const resultado = await pool.query(
            "DELETE FROM estudiantes WHERE id_estudiante = $1",
            [id]
        );

        if (resultado.rowCount === 0) {
            throw new NotFoundError(`No se puede eliminar: El estudiante con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}