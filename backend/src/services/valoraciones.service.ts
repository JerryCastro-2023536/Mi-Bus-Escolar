import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Valoraciones } from "../models/valoraciones";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarValoraciones() {
    try {
        const resultado = await pool.query("SELECT * FROM valoraciones");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarValoracionPorId(id: number) {
    try {
        const resultado = await pool.query(
            "SELECT * FROM valoraciones WHERE id_valoracion = $1",
            [id]
        );

        if (!resultado.rows[0]) {
            throw new NotFoundError(`La valoración con ID ${id} no fue encontrada.`);
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarValoraciones(p_valoraciones: Valoraciones) {
    try {
        const valores = [
            p_valoraciones.id_proveedor,
            p_valoraciones.comentario,
            p_valoraciones.calificacion
        ];

        const consulta = `
            INSERT INTO valoraciones(id_proveedor, comentario, calificacion)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const resultado = await pool.query(consulta, valores);
        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function actualizarValoracion(p_valoraciones: Valoraciones, id: number) {
    try {
        const valores = [
            p_valoraciones.id_proveedor,
            p_valoraciones.comentario,
            p_valoraciones.calificacion,
            id
        ];

        const consulta = `
            UPDATE valoraciones
            SET id_proveedor = $1,
                comentario = $2,
                calificacion = $3
            WHERE id_valoracion = $4
            RETURNING *
        `;

        const resultado = await pool.query(consulta, valores);

        if (!resultado.rows[0]) {
            throw new NotFoundError(`No se puede editar: La valoración con ID ${id} no existe.`);
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarValoracion(id: number) {
    try {
        const resultado = await pool.query(
            "DELETE FROM valoraciones WHERE id_valoracion = $1",
            [id]
        );

        if (resultado.rowCount === 0) {
            throw new NotFoundError(`No se puede eliminar: La valoración con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}