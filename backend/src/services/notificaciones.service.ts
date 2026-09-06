import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Notificaciones } from "../models/Notificaciones";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarNotificaciones() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_notificaciones_listar()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarNotificacionById(id: number) {
    try {
        const res = await pool.query("SELECT * FROM sp_notificaciones_buscar_por_id($1)", [id]);

        if (!res.rows[0]) {
            throw new NotFoundError(`La notificación con ID ${id} no fue encontrada.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarNotificacion(n: Notificaciones) {
    try {
        const values = [n.id_usuario, n.id_incidencia, n.id_asistencia, n.tipo, n.titulo, n.mensaje, n.leida, n.fecha_envio];
        const query = "SELECT * FROM sp_notificaciones_agregar($1, $2, $3, $4, $5, $6, $7, $8)";
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarNotificacionById(id: number, n: Notificaciones) {
    try {
        const values = [n.id_usuario, n.id_incidencia, n.id_asistencia, n.tipo, n.titulo, n.mensaje, n.leida, n.fecha_envio, id];
        const query = "SELECT * FROM sp_notificaciones_actualizar($1, $2, $3, $4, $5, $6, $7, $8, $9)";
        const res = await pool.query(query, values);

        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: La notificación con ID ${id} no existe.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarNotificacionById(id: number) {
    try {
        const res = await pool.query("SELECT sp_notificaciones_eliminar($1) AS filas_afectadas", [id]);

        if (res.rows[0].filas_afectadas === 0) {
            throw new NotFoundError(`No se puede eliminar: La notificación con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}
