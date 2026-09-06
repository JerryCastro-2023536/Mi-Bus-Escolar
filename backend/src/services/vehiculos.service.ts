import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Vehiculos } from "../models/Vehiculos";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarVehiculos() {
    try {
        const consulta = await pool.query("SELECT * FROM sp_vehiculos_listar()");
        return consulta.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarVehiculo(veh: Vehiculos) {
    try {
        const values = [veh.id_proveedor, veh.placa, veh.foto_vehiculo, veh.estado];
        const consulta = "SELECT * FROM sp_vehiculos_agregar($1, $2, $3, $4)";
        const resultado = await pool.query(consulta, values);
        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarVehiculo(id: number) {
    try {
        const resultado = await pool.query("SELECT * FROM sp_vehiculos_buscar_por_id($1)", [id]);
        if (!resultado.rows[0]) {
            throw new NotFoundError(`El vehiculo con el id ${id} no se encontro`);
        }
        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function actualizarVehiculo(id: number, veh: Vehiculos) {
    try {
        const values = [veh.id_proveedor, veh.placa, veh.foto_vehiculo, veh.estado, id];
        const consulta = "SELECT * FROM sp_vehiculos_actualizar($1, $2, $3, $4, $5)";
        const resultado = await pool.query(consulta, values);

        if (!resultado.rows[0]) {
            throw new NotFoundError("No se pudo editar el vehiculo porque el id no existe");
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarVehiculo(id: number) {
    try{
        const consulta = await pool.query("SELECT sp_vehiculos_eliminar($1) AS eliminadas", [id]);
        if (consulta.rows[0].eliminadas === 0) {
            throw new NotFoundError("No se pudo eliminar el vehiculo porque el id no existe");
        }
        return true;
    }catch (error) {
        errorThrower(error);
    }
}