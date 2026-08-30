import { pool } from "../config/conexion";
import { Viajes } from "../models/viajes";

export async function listarViajes() {
    const resultado = await pool.query("SELECT * FROM Viajes");
    return resultado.rows;
}

export async function buscarViajeById(id: number) {
    const res = await pool.query('SELECT * FROM Viajes WHERE id_viaje = $1', [id]);
    return res.rows[0] || null;
}

export async function agregarViaje(v: Viajes) {
    const values = [v.id_ruta, v.id_chofer, v.id_vehiculo, v.fecha_viaje, v.hora_inicio, v.hora_fin, v.estado]
    const query = 'INSERT INTO Viajes(id_ruta, id_chofer, id_vehiculo, fecha_viaje, hora_inicio, hora_fin, estado) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'
    const res = await pool.query(query, values);
    return res.rows[0];
}

export async function editarViajeById(id: number, v: Viajes) {
    const values = [v.id_ruta, v.id_chofer, v.id_vehiculo, v.fecha_viaje, v.hora_inicio, v.hora_fin, v.estado, id]
    const query = 'UPDATE Viajes SET id_ruta = $1, id_chofer = $2, id_vehiculo = $3, fecha_viaje = $4, hora_inicio = $5, hora_fin = $6, estado = $7 WHERE id_viaje = $8 RETURNING *';
    const res = await pool.query(query, values);
    return res.rows[0] || null;
}

export async function eliminarViajeById(id: number) {
    const res = await pool.query('DELETE FROM Viajes WHERE id_viaje = $1', [id])
    return (res.rowCount ?? 0) > 0
}