import { pool } from "../config/conexion";
import { RutaParada } from "../models/rutaParada";

export async function listarRutaParadas() {
    const resultado = await pool.query("SELECT * FROM Ruta_Parada");
    return resultado.rows;
}

export async function buscarRutaParadaById(id: number) {
    const res = await pool.query('SELECT * FROM Ruta_Parada WHERE id_ruta_parada = $1', [id]);
    return res.rows[0] || null;
}

export async function agregarRutaParada(r: RutaParada) {
    const values = [r.id_ruta, r.id_parada, r.orden_parada, r.minutos_estimados, r.hora_estimada]
    const query = 'INSERT INTO Ruta_Parada(id_ruta, id_parada, orden_parada, minutos_estimados, hora_estimada) VALUES($1, $2, $3, $4, $5) RETURNING *'
    const res = await pool.query(query, values);
    return res.rows[0];
}

export async function editarRutaParadaById(id: number, r: RutaParada) {
    const values = [r.id_ruta, r.id_parada, r.orden_parada, r.minutos_estimados, r.hora_estimada, id]
    const query = 'UPDATE Ruta_Parada SET id_ruta = $1, id_parada = $2, orden_parada = $3, minutos_estimados = $4, hora_estimada = $5 WHERE id_ruta_parada = $6 RETURNING *';
    const res = await pool.query(query, values);
    return res.rows[0] || null;
}

export async function eliminarRutaParadaById(id: number) {
    const res = await pool.query('DELETE FROM Ruta_Parada WHERE id_ruta_parada = $1', [id])
    return (res.rowCount ?? 0) > 0
}