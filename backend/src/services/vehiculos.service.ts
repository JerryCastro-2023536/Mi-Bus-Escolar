import { pool } from "../config/conexion";
import { Vehiculos } from "../models/Vehiculos";

export async function listarVehiculos(){
    const consulta = await pool.query("select * from vehiculos");
    return consulta.rows;
}

export async function agregarVehiculo(veh: Vehiculos){
    const values = [veh.id_proveedor, veh.placa, veh.foto_vehiculo, veh.estado]
    const consulta = "insert into vehiculos(id_proveedor, placa, foto_vehiculo, estado) values($1, $2, $3, $4)"
    const resultado = await pool.query(consulta, values)
    return resultado.rows[0];
}

export async function buscarVehiculo(id: number){
    const resultado = await pool.query("select * from vehiculos where id_vehiculo = $1", [id])
    return resultado.rows[0]
}

export async function actualizarVehiculo(id: number, veh: Vehiculos){
    const values = [veh.id_proveedor, veh.placa, veh.foto_vehiculo, veh.estado, id]
    const consulta = "update vehiculos set id_proveedor=$1, placa=$2, foto_vehiculo=$3, estado=$4 where id_vehiculo=$5"
    const resultado = await pool.query(consulta, values)
    return resultado.rows[0];
}

export async function eliminarVehiculo(id: number){
    const consulta = await pool.query("delete from vehiculos where id_vehiculo = $1", [id]);
    console.log("se ha eliminado el vehiculo correctamente")
    return (consulta.rowCount ?? 0) > 0
}