import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Viajes } from "../models/viajes";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarViajes() {
    try {
        const resultado = await pool.query("SELECT * FROM Viajes");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarViajeById(id: number) {
    try {
        const res = await pool.query('SELECT * FROM Viajes WHERE id_viaje = $1', [id]);
        
        if (!res.rows[0]) {
            throw new NotFoundError(`El viaje con ID ${id} no fue encontrado.`);
        }
        
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarViaje(v: Viajes) {
    try {
        const values = [v.id_ruta, v.id_chofer, v.id_vehiculo, v.fecha_viaje, v.hora_inicio, v.hora_fin, v.estado];
        const query = 'INSERT INTO Viajes(id_ruta, id_chofer, id_vehiculo, fecha_viaje, hora_inicio, hora_fin, estado) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarViajeById(id: number, v: Viajes) {
    try {
        const values = [v.id_ruta, v.id_chofer, v.id_vehiculo, v.fecha_viaje, v.hora_inicio, v.hora_fin, v.estado, id];
        const query = 'UPDATE Viajes SET id_ruta = $1, id_chofer = $2, id_vehiculo = $3, fecha_viaje = $4, hora_inicio = $5, hora_fin = $6, estado = $7 WHERE id_viaje = $8 RETURNING *';
        const res = await pool.query(query, values);
        
        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: El viaje con ID ${id} no existe.`);
        }
        
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarViajeById(id: number) {
    try {
        const res = await pool.query('DELETE FROM Viajes WHERE id_viaje = $1', [id]);
        
        if (res.rowCount === 0) {
            throw new NotFoundError(`No se puede eliminar: El viaje con ID ${id} no existe.`);
        }
        
        return true;
    } catch (error) {
        errorThrower(error);
    }
}