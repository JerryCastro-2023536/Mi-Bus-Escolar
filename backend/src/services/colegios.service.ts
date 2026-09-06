import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Colegios } from "../models/colegios";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarColegios() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_colegios_obtener()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarColegioById(id: number) {
    try {
        const res = await pool.query("SELECT * FROM sp_colegios_buscar($1)", [id]);

        if (!res.rows[0]) {
            throw new NotFoundError(`El colegio con ID ${id} no fue encontrado.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarColegio(c: Colegios) {
    try {
        const values = [c.nombre, c.direccion, c.telefono_contacto];
        const query = "SELECT * FROM sp_colegios_crear($1, $2, $3)";
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarColegioById(id: number, c: Colegios) {
    try {
        const values = [id, c.nombre, c.direccion, c.telefono_contacto];
        const query = "SELECT * FROM sp_colegios_editar($1, $2, $3, $4)";
        const res = await pool.query(query, values);

        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: El colegio con ID ${id} no existe.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarColegioById(id: number) {
    try {
        const res = await pool.query("SELECT sp_colegios_eliminar($1) AS eliminado", [id]);

        if (!res.rows[0].eliminado) {
            throw new NotFoundError(`No se puede eliminar: El colegio con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}
