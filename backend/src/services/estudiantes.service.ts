import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Estudiantes } from "../models/estudiantes";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarEstudiantes() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_estudiantes_obtener()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarEstudianteById(id: number) {
    try {
        const res = await pool.query("SELECT * FROM sp_estudiantes_buscar($1)", [id]);

        if (!res.rows[0]) {
            throw new NotFoundError(`El estudiante con ID ${id} no fue encontrado.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarEstudiante(e: Estudiantes) {
    try {
        const values = [e.id_usuario_tutor, e.id_colegio, e.nombre, e.apellido, e.fecha_nacimiento, e.foto_estudiante, e.grado];
        const query = "SELECT * FROM sp_estudiantes_crear($1, $2, $3, $4, $5, $6, $7)";
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarEstudianteById(id: number, e: Estudiantes) {
    try {
        const values = [id, e.id_usuario_tutor, e.id_colegio, e.nombre, e.apellido, e.fecha_nacimiento, e.foto_estudiante, e.grado];
        const query = "SELECT * FROM sp_estudiantes_editar($1, $2, $3, $4, $5, $6, $7, $8)";
        const res = await pool.query(query, values);

        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: El estudiante con ID ${id} no existe.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarEstudianteById(id: number) {
    try {
        const res = await pool.query("SELECT sp_estudiantes_eliminar($1) AS eliminado", [id]);

        if (!res.rows[0].eliminado) {
            throw new NotFoundError(`No se puede eliminar: El estudiante con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}
