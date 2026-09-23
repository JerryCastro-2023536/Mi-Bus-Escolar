import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Valoraciones, ValoracionUsuarioPayload } from "../models/valoraciones";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarValoraciones() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_valoraciones_obtener()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function listarValoracionesDetalle() {
    try {
        const resultado = await pool.query(
            "SELECT * FROM sp_valoraciones_obtener_detalle()",
        );
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarValoracionPorId(id: number) {
    try {
        const resultado = await pool.query(
            "SELECT * FROM sp_valoraciones_buscar($1)",
            [id],
        );

        if (!resultado.rows[0]) {
            throw new NotFoundError(`La valoración con ID ${id} no fue encontrada.`);
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarValoraciones(valoracion: Valoraciones) {
    try {
        const resultado = await pool.query(
            "SELECT * FROM sp_valoraciones_crear($1, $2, $3, $4)",
            [
                valoracion.id_servicio,
                valoracion.id_usuario,
                valoracion.comentario,
                valoracion.calificacion,
            ],
        );
        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function actualizarValoracion(valoracion: Valoraciones, id: number) {
    try {
        const resultado = await pool.query(
            "SELECT * FROM sp_valoraciones_editar($1, $2, $3, $4, $5)",
            [
                id,
                valoracion.id_servicio,
                valoracion.id_usuario,
                valoracion.comentario,
                valoracion.calificacion,
            ],
        );

        if (!resultado.rows[0]) {
            throw new NotFoundError(
                `No se puede editar: La valoración con ID ${id} no existe.`,
            );
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarValoracion(id: number) {
    try {
        const resultado = await pool.query(
            "SELECT sp_valoraciones_eliminar($1) AS eliminado",
            [id],
        );

        if (!resultado.rows[0]?.eliminado) {
            throw new NotFoundError(
                `No se puede eliminar: La valoración con ID ${id} no existe.`,
            );
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}

export async function guardarValoracionServicio(
    idServicio: number,
    idUsuario: number,
    payload: ValoracionUsuarioPayload,
) {
    try {
        const resultado = await pool.query(
            "SELECT * FROM sp_valoracion_usuario_guardar($1, $2, $3, $4)",
            [
                idServicio,
                idUsuario,
                payload.comentario ?? null,
                payload.calificacion,
            ],
        );

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}
