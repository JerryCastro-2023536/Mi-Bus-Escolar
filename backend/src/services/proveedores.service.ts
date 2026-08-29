import { pool } from "../config/conexion";
import { Proveedores } from "../models/Proveedores";

export async function listarProveedores(){
    const consulta = await pool.query("select * from proveedores");
    return consulta.rows;
}

export async function agregarProveedor(prov: Proveedores){
    const values = [prov.id_usuario, prov.nombre_negocio, prov.direccion, prov.telefono_contacto]
    const consulta = "insert into proveedores(id_usuario, nombre_negocio, direccion, telefono_contacto) values($1, $2, $3, $4)"
    const resultado = await pool.query(consulta, values)
    return resultado.rows[0];
}

export async function buscarProveedor(id: number){
    const resultado = await pool.query("select * from proveedores where id_proveedor = $1", [id])
    return resultado.rows[0]
}

export async function actualizarProveedor(id: number, prov: Proveedores){
    const values = [prov.id_usuario, prov.nombre_negocio, prov.direccion, prov.telefono_contacto, id]
    const consulta = "update proveedores set id_usuario=$1, nombre_negocio=$2, direccion=$3, telefono_contacto=$4 where id_proveedor=$5"
    const resultado = await pool.query(consulta, values)
    return resultado.rows[0];
}

export async function eliminarProveedor(id: number){
    const consulta = await pool.query("delete from proveedores where id_proveedor = $1", [id]);
    console.log("se ha eliminado el proveedor correctamente")
    return (consulta.rowCount ?? 0) > 0
}