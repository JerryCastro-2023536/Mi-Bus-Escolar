import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Proveedores } from "../models/Proveedores";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarProveedores(){
    try{
        const consulta = await pool.query("select * from sp_proveedores_obtener()");
        return consulta.rows;
    }catch(error){
        errorThrower(error)
    }
}

export async function agregarProveedor(prov: Proveedores){
    try{
        const values = [prov.id_usuario, prov.nombre_negocio, prov.direccion, prov.telefono_contacto]
        const consulta = "select * from sp_proveedores_crear($1, $2, $3, $4)"
        const resultado = await pool.query(consulta, values)
        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function buscarProveedor(id: number){
    try{
        const resultado = await pool.query("select * from sp_proveedores_buscar($1)", [id])

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
        const values = [id, prov.id_usuario, prov.nombre_negocio, prov.direccion, prov.telefono_contacto]
        const consulta = "select * from sp_proveedores_editar($1, $2, $3, $4, $5)"
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
        const consulta = await pool.query("select sp_proveedores_eliminar($1)", [id]);
        
        if(consulta.rowCount === 0){
            throw new NotFoundError("no se pudo eliminar el proveedor porque el id no existe")
        }

        return true
    }catch(error){
        errorThrower(error)
    }
}