import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Viajes } from "../models/viajes";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarViajes() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_viajes_listar()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarViajeById(id: number) {
    try {
        const res = await pool.query('SELECT * FROM sp_viajes_buscar_por_id($1)', [id]);
        
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
        const query = 'SELECT * FROM sp_viajes_agregar($1, $2, $3, $4, $5, $6, $7)';
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarViajeById(id: number, v: Viajes) {
    try {
        const values = [v.id_ruta, v.id_chofer, v.id_vehiculo, v.fecha_viaje, v.hora_inicio, v.hora_fin, v.estado, id];
        const query = 'SELECT * FROM sp_viajes_actualizar($1, $2, $3, $4, $5, $6, $7, $8)';
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
        const res = await pool.query('SELECT sp_viajes_eliminar($1) AS eliminadas', [id]);
        
        if (res.rows[0].eliminadas === 0) {
            throw new NotFoundError(`No se puede eliminar: El viaje con ID ${id} no existe.`);
        }
        
        return true;
    } catch (error) {
        errorThrower(error);
    }
}