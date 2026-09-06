import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Choferes } from "../models/choferes";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarChoferes() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_choferes_obtener()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarChoferById(id: number) {
    try {
        const res = await pool.query("SELECT * FROM sp_choferes_buscar($1)", [id]);

        if (!res.rows[0]) {
            throw new NotFoundError(`El chofer con ID ${id} no fue encontrado.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarChofer(c: Choferes) {
    try {
        const values = [c.id_usuario, c.telefono_contacto, c.estado];
        const query = "SELECT * FROM sp_choferes_crear($1, $2, $3)";
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarChoferById(id: number, c: Choferes) {
    try {
        const values = [id, c.id_usuario, c.telefono_contacto, c.estado];
        const query = "SELECT * FROM sp_choferes_editar($1, $2, $3, $4)";
        const res = await pool.query(query, values);

        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: El chofer con ID ${id} no existe.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarChoferById(id: number) {
    try {
        const res = await pool.query("SELECT sp_choferes_eliminar($1) AS eliminado", [id]);

        if (!res.rows[0].eliminado) {
            throw new NotFoundError(`No se puede eliminar: El chofer con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}
