import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Choferes } from "../models/choferes";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarChoferes() {
    try {
        const resultado = await pool.query("SELECT * FROM choferes");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarChoferPorId(id: number) {
    try {
        const resultado = await pool.query(
            "SELECT * FROM choferes WHERE id_chofer = $1",
            [id]
        );

        if (!resultado.rows[0]) {
            throw new NotFoundError(`El chofer con ID ${id} no fue encontrado.`);
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarChoferes(p_choferes: Choferes) {
    try {
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
    } catch (error) {
        errorThrower(error);
    }
}

export async function actualizarChofer(p_choferes: Choferes, id: number) {
    try {
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

        if (!resultado.rows[0]) {
            throw new NotFoundError(`No se puede editar: El chofer con ID ${id} no existe.`);
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarChofer(id: number) {
    try {
        const resultado = await pool.query(
            "DELETE FROM choferes WHERE id_chofer = $1",
            [id]
        );

        if (resultado.rowCount === 0) {
            throw new NotFoundError(`No se puede eliminar: El chofer con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}