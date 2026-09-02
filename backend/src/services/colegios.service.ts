import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Colegios } from "../models/colegios";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarColegios() {
    try {
        const resultado = await pool.query("SELECT * FROM colegios");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarColegioPorId(id: number) {
    try {
        const resultado = await pool.query(
            "SELECT * FROM colegios WHERE id_colegio = $1",
            [id]
        );

        if (!resultado.rows[0]) {
            throw new NotFoundError(`El colegio con ID ${id} no fue encontrado.`);
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarColegios(p_colegios: Colegios) {
    try {
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
    } catch (error) {
        errorThrower(error);
    }
}

export async function actualizarColegio(p_colegios: Colegios, id: number) {
    try {
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

        if (!resultado.rows[0]) {
            throw new NotFoundError(`No se puede editar: El colegio con ID ${id} no existe.`);
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarColegio(id: number) {
    try {
        const resultado = await pool.query(
            "DELETE FROM colegios WHERE id_colegio = $1",
            [id]
        );

        if (resultado.rowCount === 0) {
            throw new NotFoundError(`No se puede eliminar: El colegio con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}