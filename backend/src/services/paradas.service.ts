import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Paradas } from "../models/Paradas";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarParadas() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_paradas_listar()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarParadaById(id: number) {
    try {
        const res = await pool.query("SELECT * FROM sp_paradas_buscar_por_id($1)", [id]);

        if (!res.rows[0]) {
            throw new NotFoundError(`La parada con ID ${id} no fue encontrada.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarParada(p: Paradas) {
    try {
        const values = [p.nombre, p.direccion, p.latitud, p.longitud];
        const query = "SELECT * FROM sp_paradas_agregar($1, $2, $3, $4)";
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarParadaById(id: number, p: Paradas) {
    try {
        const values = [p.nombre, p.direccion, p.latitud, p.longitud, id];
        const query = "SELECT * FROM sp_paradas_actualizar($1, $2, $3, $4, $5)";
        const res = await pool.query(query, values);

        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: La parada con ID ${id} no existe.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarParadaById(id: number) {
    try {
        const res = await pool.query("SELECT sp_paradas_eliminar($1) AS filas_afectadas", [id]);

        if (res.rows[0].filas_afectadas === 0) {
            throw new NotFoundError(`No se puede eliminar: La parada con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}
