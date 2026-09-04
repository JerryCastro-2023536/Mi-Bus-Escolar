import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { RutaParada } from "../models/rutaParada";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarRutaParadas() {
    try {
        const resultado = await pool.query("SELECT * FROM Ruta_Parada");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarRutaParadaById(id: number) {
    try {
        const res = await pool.query('SELECT * FROM Ruta_Parada WHERE id_ruta_parada = $1', [id]);
        
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
        const query = 'INSERT INTO Ruta_Parada(id_ruta, id_parada, orden_parada, minutos_estimados, hora_estimada) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarRutaParadaById(id: number, r: RutaParada) {
    try {
        const values = [r.id_ruta, r.id_parada, r.orden_parada, r.minutos_estimados, r.hora_estimada, id];
        const query = 'UPDATE Ruta_Parada SET id_ruta = $1, id_parada = $2, orden_parada = $3, minutos_estimados = $4, hora_estimada = $5 WHERE id_ruta_parada = $6 RETURNING *';
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
        const res = await pool.query('DELETE FROM Ruta_Parada WHERE id_ruta_parada = $1', [id]);
        
        if (res.rowCount === 0) {
            throw new NotFoundError(`No se puede eliminar: La ruta parada con ID ${id} no existe.`);
        }
        
        return true;
    } catch (error) {
        errorThrower(error);
    }
}