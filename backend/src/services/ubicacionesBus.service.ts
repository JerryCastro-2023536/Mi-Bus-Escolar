import { pool } from "../config/conexion";
import { UbicacionesBus } from "../models/ubicacionesBus";

export async function listarUbicacionesBus() {
    const resultado = await pool.query("SELECT * FROM Ubicaciones_Bus");
    return resultado.rows;
}

export async function buscarUbicacionBusById(id: number) {
    const res = await pool.query('SELECT * FROM Ubicaciones_Bus WHERE id_ubicacion = $1', [id]);
    return res.rows[0] || null;
}

export async function agregarUbicacionBus(u: UbicacionesBus) {
    const values = [u.id_viaje, u.latitud, u.longitud, u.velocidad, u.fecha_hora]
    const query = 'INSERT INTO Ubicaciones_Bus(id_viaje, latitud, longitud, velocidad, fecha_hora) VALUES($1, $2, $3, $4, $5) RETURNING *'
    const res = await pool.query(query, values);
    return res.rows[0];
}

export async function editarUbicacionBusById(id: number, u: UbicacionesBus) {
    const values = [u.id_viaje, u.latitud, u.longitud, u.velocidad, u.fecha_hora, id]
    const query = 'UPDATE Ubicaciones_Bus SET id_viaje = $1, latitud = $2, longitud = $3, velocidad = $4, fecha_hora = $5 WHERE id_ubicacion = $6 RETURNING *';
    const res = await pool.query(query, values);
    return res.rows[0] || null;
}

export async function eliminarUbicacionBusById(id: number) {
    const res = await pool.query('DELETE FROM Ubicaciones_Bus WHERE id_ubicacion = $1', [id])
    return (res.rowCount ?? 0) > 0
}