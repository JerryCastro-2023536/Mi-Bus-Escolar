import { pool } from "../config/conexion";
import { Colegios } from "../models/colegios";

export async function listarColegios() {
    const resultado = await pool.query("SELECT * FROM colegios");
    return resultado.rows;
}

export async function agregarColegios(p_colegios: Colegios) {
    const valores = [
        p_colegios.nombre,
        p_colegios.direccion,
        p_colegios.telefono_contacto
    ];

    const consulta = `
        INSERT INTO colegios(nombre, direccion, telefono_contacto)
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function buscarColegioPorId(id: number) {
    const valor = [id];

    const resultado = await pool.query(
        "SELECT * FROM colegios WHERE id_colegio = $1",
        valor
    );

    return resultado.rows[0];
}

export async function actualizarColegio(
    p_colegios: Colegios,
    id: number
) {
    const valores = [
        p_colegios.nombre,
        p_colegios.direccion,
        p_colegios.telefono_contacto,
        id
    ];

    const consulta = `
        UPDATE colegios
        SET nombre = $1,
            direccion = $2,
            telefono_contacto = $3
        WHERE id_colegio = $4
        RETURNING *
    `;

    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function eliminarColegio(id: number) {
    const valor = [id];

    const resultado = await pool.query(
        "DELETE FROM colegios WHERE id_colegio = $1",
        valor
    );

    console.log("Eliminado correctamente");
}