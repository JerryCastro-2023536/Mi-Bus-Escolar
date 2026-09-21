import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Rutas } from "../models/Rutas";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarRutas(){
    try{
        const consulta = await pool.query("select * from sp_rutas_obtener()");
        return consulta.rows;
    }catch(error){
        errorThrower(error)
    }
}

export async function agregarRuta(rut: Rutas){
    try{
        const values = [rut.id_servicio, rut.id_vehiculo, rut.id_chofer, rut.nombre, rut.hora_inicio_estimada, rut.hora_fin_estimada, rut.estado]
        const consulta = "select * from sp_rutas_crear($1, $2, $3, $4, $5, $6, $7)"
        const resultado = await pool.query(consulta, values)
        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function buscarRuta(id: number){
    try{
        const resultado = await pool.query("select * from sp_rutas_buscar($1)", [id])
        if(!resultado.rows[0]){
            throw new NotFoundError(`la ruta con el id ${id} no se encontro`)
        }
        return resultado.rows[0]
    }catch(error){
        errorThrower(error)
    }
}

export async function actualizarRuta(id: number, rut: Rutas){
    try{
        const values = [id, rut.id_servicio, rut.id_vehiculo, rut.id_chofer, rut.nombre, rut.hora_inicio_estimada, rut.hora_fin_estimada, rut.estado]
        const consulta = "select * from sp_rutas_editar($1, $2, $3, $4, $5, $6, $7, $8)"
        const resultado = await pool.query(consulta, values)

        if(!resultado.rows[0]){
            throw new NotFoundError("no se pudo editar la ruta porque el id no existe")
        }

        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function eliminarRuta(id: number){
    try{
        const consulta = await pool.query("select sp_rutas_eliminar($1)", [id]);
        if (!consulta.rows[0].eliminado){
            throw new NotFoundError("no se pudo eliminar la ruta porque el id no existe")
        }
        return true
    }catch(error){
        errorThrower(error)
    }
}