import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Vehiculos } from "../models/Vehiculos";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarVehiculos(){
    try{
        const consulta = await pool.query("select * from vehiculos");
        return consulta.rows;
    }catch(error){
        errorThrower(error)
    }
}

export async function agregarVehiculo(veh: Vehiculos){
    try{
        const values = [veh.id_proveedor, veh.placa, veh.foto_vehiculo, veh.estado]
        const consulta = "insert into vehiculos(id_proveedor, placa, foto_vehiculo, estado) values($1, $2, $3, $4) returning *"
        const resultado = await pool.query(consulta, values)
        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function buscarVehiculo(id: number){
    try{
        const resultado = await pool.query("select * from vehiculos where id_vehiculo = $1", [id])
        if(!resultado.rows[0]){
            throw new NotFoundError(`el vehiculo con el id ${id} no se encontro`)
        }
        return resultado.rows[0]
    }catch(error){
        errorThrower(error)
    }
}

export async function actualizarVehiculo(id: number, veh: Vehiculos){
    try{
        const values = [veh.id_proveedor, veh.placa, veh.foto_vehiculo, veh.estado, id]
        const consulta = "update vehiculos set id_proveedor=$1, placa=$2, foto_vehiculo=$3, estado=$4 where id_vehiculo=$5 returning *"
        const resultado = await pool.query(consulta, values)

        if(!resultado.rows[0]){
            throw new NotFoundError("no se pudo editar el vehiculo porque el id no existe")
        }

        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function eliminarVehiculo(id: number){
    try{
        const consulta = await pool.query("delete from vehiculos where id_vehiculo = $1", [id]);
        if(consulta.rowCount === 0){
            throw new NotFoundError("no se pudo eliminar el vehiculo porque el id no existe")
        }
        return true
    }catch(error){
        errorThrower(error)
    }
}