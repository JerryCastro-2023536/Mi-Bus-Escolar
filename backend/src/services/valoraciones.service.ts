import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Valoraciones } from "../models/valoraciones";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarValoraciones() {
    try {
        const resultado = await pool.query("select * from sp_valoraciones_obtener()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarValoracionPorId(id: number) {
    try {
        const resultado = await pool.query(
            "select * from sp_valoraciones_buscar($1)",
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
            select * from sp_valoraciones_crear($1, $2, $3)
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
            id,
            p_valoraciones.id_proveedor,
            p_valoraciones.comentario,
            p_valoraciones.calificacion
        ];

        const consulta = `
            select * from sp_valoraciones_editar($1, $2, $3, $4)
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
            "select sp_valoraciones_eliminar($1)",
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