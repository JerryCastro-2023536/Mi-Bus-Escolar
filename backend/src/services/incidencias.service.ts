import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Incidencias } from "../models/Incidencias";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarIncidencias() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_incidencias_obtener()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarIncidenciaById(id: number) {
    try {
        const res = await pool.query("SELECT * FROM sp_incidencias_buscar($1)", [id]);

        if (!res.rows[0]) {
            throw new NotFoundError(`La incidencia con ID ${id} no fue encontrada.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarIncidencia(i: Incidencias) {
    try {
        const values = [i.id_viaje, i.id_ruta, i.id_usuario_reporta, i.titulo, i.descripcion, i.latitud, i.longitud, i.estado];
        const query = "SELECT * FROM sp_incidencias_crear($1, $2, $3, $4, $5, $6, $7, $8)";
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarIncidenciaById(id: number, i: Incidencias) {
    try {
        const values = [id, i.id_viaje, i.id_ruta, i.id_usuario_reporta, i.titulo, i.descripcion, i.latitud, i.longitud, i.estado];
        const query = "SELECT * FROM sp_incidencias_editar($1, $2, $3, $4, $5, $6, $7, $8, $9)";
        const res = await pool.query(query, values);

        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: La incidencia con ID ${id} no existe.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarIncidenciaById(id: number) {
    try {
        const res = await pool.query("SELECT sp_incidencias_eliminar($1) AS eliminado", [id]);

        if (!res.rows[0].eliminado) {
            throw new NotFoundError(`No se puede eliminar: La incidencia con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}
