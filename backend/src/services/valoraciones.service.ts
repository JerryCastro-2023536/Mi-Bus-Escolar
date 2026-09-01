import { pool } from "../config/conexion";
import { Valoraciones } from "../models/valoraciones";

export async function listarValoraciones() {
    const resultado = await pool.query("SELECT * FROM valoraciones");
    return resultado.rows;
}

export async function agregarValoraciones(p_valoraciones: Valoraciones) {
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
}

export async function buscarValoracionPorId(id: number) {
    const valor = [id];

    const resultado = await pool.query(
        "SELECT * FROM valoraciones WHERE id_valoracion = $1",
        valor
    );

    return resultado.rows[0];
}

export async function actualizarValoracion(
    p_valoraciones: Valoraciones,
    id: number
) {
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
    return resultado.rows[0];
}

export async function eliminarValoracion(id: number) {
    const valor = [id];

    const resultado = await pool.query(
        "DELETE FROM valoraciones WHERE id_valoracion = $1",
        valor
    );

    console.log("Eliminado correctamente");
}