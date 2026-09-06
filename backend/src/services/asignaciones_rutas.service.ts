import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Asignaciones_Ruta } from "../models/Asignaciones_Rutas";
import { errorThrower } from "../utils/middleware/errorThrower";


export async function listarAsignacionesRuta() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_asignaciones_ruta_listar()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarAsignacionRutaById(id: number) {
    try {
        const res = await pool.query("SELECT * FROM sp_asignaciones_ruta_buscar_por_id($1)", [id]);

        if (!res.rows[0]) {
            throw new NotFoundError(`La asignación de ruta con ID ${id} no fue encontrada.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarAsignacionRuta(a: Asignaciones_Ruta) {
    try {
        const values = [a.id_estudiante, a.id_ruta, a.id_parada_recogida, a.id_parada_descenso];
        const query = "SELECT * FROM sp_asignaciones_ruta_agregar($1, $2, $3, $4)";
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarAsignacionRutaById(id: number, a: Asignaciones_Ruta) {
    try {
        const values = [a.id_estudiante, a.id_ruta, a.id_parada_recogida, a.id_parada_descenso, id];
        const query = "SELECT * FROM sp_asignaciones_ruta_actualizar($1, $2, $3, $4, $5)";
        const res = await pool.query(query, values);

        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: La asignación de ruta con ID ${id} no existe.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarAsignacionRutaById(id: number) {
    try {
        const res = await pool.query("SELECT sp_asignaciones_ruta_eliminar($1) AS filas_afectadas", [id]);

        if (res.rows[0].filas_afectadas === 0) {
            throw new NotFoundError(`No se puede eliminar: La asignación de ruta con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}
