import { pool } from "../config/conexion";
import { Rutas } from "../models/Rutas";

export async function listarRutas(){
    const consulta = await pool.query("select * from rutas");
    return consulta.rows;
}

export async function agregarRuta(rut: Rutas){
    const values = [rut.id_servicio, rut.id_vehiculo, rut.id_chofer, rut.nombre, rut.hora_inicio_estimada, rut.hora_fin_estimada, rut.estado]
    const consulta = "insert into rutas(id_servicio, id_vehiculo, id_chofer, nombre, hora_inicio_estimada, hora_fin_estimada, estado) values($1, $2, $3, $4, $5, $6, $7)"
    const resultado = await pool.query(consulta, values)
    return resultado.rows[0];
}

export async function buscarRuta(id: number){
    const resultado = await pool.query("select * from rutas where id_ruta = $1", [id])
    return resultado.rows[0]
}

export async function actualizarRuta(id: number, rut: Rutas){
    const values = [rut.id_servicio, rut.id_vehiculo, rut.id_chofer, rut.nombre, rut.hora_inicio_estimada, rut.hora_fin_estimada, rut.estado, id]
    const consulta = "update rutas set id_servicio=$1, id_vehiculo=$2, id_chofer=$3, nombre=$4, hora_inicio_estimada=$5, hora_fin_estimada=$6, estado=$7 where id_ruta=$8"
    const resultado = await pool.query(consulta, values)
    return resultado.rows[0];
}

export async function eliminarRuta(id: number){
    const consulta = await pool.query("delete from rutas where id_ruta = $1", [id]);
    console.log("se ha eliminado la ruta correctamente")
    return (consulta.rowCount ?? 0) > 0
}