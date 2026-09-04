import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Proveedores } from "../models/Proveedores";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarProveedores(){
    try{
        const consulta = await pool.query("select * from proveedores");
        return consulta.rows;
    }catch(error){
        errorThrower(error)
    }
}

export async function agregarProveedor(prov: Proveedores){
    try{
        const values = [prov.id_usuario, prov.nombre_negocio, prov.direccion, prov.telefono_contacto]
        const consulta = "insert into proveedores(id_usuario, nombre_negocio, direccion, telefono_contacto) values($1, $2, $3, $4) returning *"
        const resultado = await pool.query(consulta, values)
        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function buscarProveedor(id: number){
    try{
        const resultado = await pool.query("select * from proveedores where id_proveedor = $1", [id])

        if(!resultado.rows[0]){
            throw new NotFoundError(`el id del proveedor ${id} no se encontro`)
        }
        return resultado.rows[0]
    }catch(error){
        errorThrower(error)
    }
}

export async function actualizarProveedor(id: number, prov: Proveedores){
    try{
        const values = [prov.id_usuario, prov.nombre_negocio, prov.direccion, prov.telefono_contacto, id]
        const consulta = "update proveedores set id_usuario=$1, nombre_negocio=$2, direccion=$3, telefono_contacto=$4 where id_proveedor=$5 returning *"
        const resultado = await pool.query(consulta, values)

        if(!resultado.rows[0]){
            throw new NotFoundError(`no se pudo editar el proveedor porque el id ${id} no existe`)
        }

        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function eliminarProveedor(id: number){
    try{
        const consulta = await pool.query("delete from proveedores where id_proveedor = $1", [id]);
        
        if(consulta.rowCount === 0){
            throw new NotFoundError("no se pudo eliminar el proveedor porque el id no existe")
        }

        return true
    }catch(error){
        errorThrower(error)
    }
}