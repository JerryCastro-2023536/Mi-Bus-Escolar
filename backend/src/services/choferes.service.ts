import { pool } from "../config/conexion";
import { Choferes } from "../models/choferes";

export async function listarChoferes() {
    const resultado = await pool.query("SELECT * FROM choferes");
    return resultado.rows;
}

export async function agregarChoferes(p_choferes: Choferes) {
    const valores = [
        p_choferes.id_usuario,
        p_choferes.telefono_contacto,
        p_choferes.estado
    ];

    const consulta = `
        INSERT INTO choferes(id_usuario, telefono_contacto, estado)
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function buscarChoferPorId(id: number) {
    const valor = [id];

    const resultado = await pool.query(
        "SELECT * FROM choferes WHERE id_chofer = $1",
        valor
    );

    return resultado.rows[0];
}

export async function actualizarChofer(
    p_choferes: Choferes,
    id: number
) {
    const valores = [
        p_choferes.id_usuario,
        p_choferes.telefono_contacto,
        p_choferes.estado,
        id
    ];

    const consulta = `
        UPDATE choferes
        SET id_usuario = $1,
            telefono_contacto = $2,
            estado = $3
        WHERE id_chofer = $4
        RETURNING *
    `;

    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function eliminarChofer(id: number) {
    const valor = [id];

    const resultado = await pool.query(
        "DELETE FROM choferes WHERE id_chofer = $1",
        valor
    );

    console.log("Eliminado correctamente");
}