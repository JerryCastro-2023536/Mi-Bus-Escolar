import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { RutaParada } from "../models/rutaParada";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarRutaParadas() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_ruta_parada_listar()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarRutaParadaById(id: number) {
    try {
        const res = await pool.query("SELECT * FROM sp_ruta_parada_buscar_por_id($1)", [id]);
        
        if (!res.rows[0]) {
            throw new NotFoundError(`La ruta parada con ID ${id} no fue encontrada.`);
        }
        
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarRutaParada(r: RutaParada) {
    try {
        const values = [r.id_ruta, r.id_parada, r.orden_parada, r.minutos_estimados, r.hora_estimada];
        const query = `SELECT * FROM sp_ruta_parada_agregar($1, $2, $3, $4, $5)`;
        const res = await pool.query(query, values);
        
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarRutaParadaById(id: number, r: RutaParada) {
    try {
        const values = [r.id_ruta, r.id_parada, r.orden_parada, r.minutos_estimados, r.hora_estimada, id];
        const query = `SELECT * FROM sp_ruta_parada_actualizar($1, $2, $3, $4, $5, $6)`;
        const res = await pool.query(query, values);
        
        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: La ruta parada con ID ${id} no existe.`);
        }
        
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarRutaParadaById(id: number) {
    try {
        const res = await pool.query("SELECT sp_ruta_parada_eliminar($1) AS eliminadas", [id]);
        
        if (res.rows[0].eliminadas === 0) {
            throw new NotFoundError(`No se puede eliminar: La ruta parada con ID ${id} no existe.`);
        }
        
        return true;
    } catch (error) {
        errorThrower(error);
    }
}