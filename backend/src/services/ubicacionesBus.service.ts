import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { UbicacionesBus } from "../models/ubicacionesBus";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarUbicacionesBus() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_ubicaciones_bus_listar()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarUbicacionBusById(id: number) {
    try {
        const res = await pool.query('SELECT * FROM sp_ubicaciones_bus_buscar_por_id($1)', [id]);
        
        if (!res.rows[0]) {
            throw new NotFoundError(`La ubicación de bus con ID ${id} no fue encontrada.`);
        }
        
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarUbicacionBus(u: UbicacionesBus) {
    try {
        const values = [u.id_viaje, u.latitud, u.longitud, u.velocidad];
        const query = 'SELECT * FROM sp_ubicaciones_bus_agregar($1, $2, $3, $4)';
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarUbicacionBusById(id: number, u: UbicacionesBus) {
    try {
        const values = [u.id_viaje, u.latitud, u.longitud, u.velocidad, id];
        const query = 'SELECT * FROM sp_ubicaciones_bus_actualizar($1, $2, $3, $4, $5)';
        const res = await pool.query(query, values);
        
        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: La ubicación de bus con ID ${id} no existe.`);
        }
        
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarUbicacionBusById(id: number) {
    try {
        const res = await pool.query('SELECT sp_ubicaciones_bus_eliminar($1) AS eliminadas', [id]);
        
        if (res.rows[0].eliminadas === 0) {
            throw new NotFoundError(`No se puede eliminar: La ubicación de bus con ID ${id} no existe.`);
        }
        
        return true;
    } catch (error) {
        errorThrower(error);
    }
}