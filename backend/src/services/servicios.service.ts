import { pool } from "../config/conexion";
import { Servicios } from "../models/Servicios";

export async function listarServicios(){
    const consulta = await pool.query("select * from servicios");
    return consulta.rows;
}

export async function agregarServicio(serv: Servicios){
    const values = [serv.id_proveedor, serv.nombre, serv.descripcion, serv.precio_mensual, serv.estado, serv.fecha_creacion]
    const consulta = "insert into servicios(id_proveedor, nombre, descripcion, precio_mensual, estado, fecha_creacion) values($1, $2, $3, $4, $5, $6)"
    const resultado = await pool.query(consulta, values)
    return resultado.rows[0];
}

export async function buscarServicio(id: number){
    const resultado = await pool.query("select * from servicios where id_servicio = $1", [id])
    return resultado.rows[0]
}

export async function actualizarServicio(id: number, serv: Servicios){
    const values = [serv.id_proveedor, serv.nombre, serv.descripcion, serv.precio_mensual, serv.estado, serv.fecha_creacion, id]
    const consulta = "update servicios set id_proveedor=$1, nombre=$2, descripcion=$3, precio_mensual=$4, estado=$5, fecha_creacion=$6 where id_servicio=$7"
    const resultado = await pool.query(consulta, values)
    return resultado.rows[0];
}

export async function eliminarServicio(id: number){
    const consulta = await pool.query("delete from servicios where id_servicio = $1", [id]);
    console.log("se ha eliminado el servicio correctamente")
    return (consulta.rowCount ?? 0) > 0
}