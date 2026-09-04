import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Rutas } from "../models/Rutas";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarRutas(){
    try{
        const consulta = await pool.query("select * from rutas");
        return consulta.rows;
    }catch(error){
        errorThrower(error)
    }
}

export async function agregarRuta(rut: Rutas){
    try{
        const values = [rut.id_servicio, rut.id_vehiculo, rut.id_chofer, rut.nombre, rut.hora_inicio_estimada, rut.hora_fin_estimada, rut.estado]
        const consulta = "insert into rutas(id_servicio, id_vehiculo, id_chofer, nombre, hora_inicio_estimada, hora_fin_estimada, estado) values($1, $2, $3, $4, $5, $6, $7) returning *"
        const resultado = await pool.query(consulta, values)
        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function buscarRuta(id: number){
    try{
        const resultado = await pool.query("select * from rutas where id_ruta = $1", [id])
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
        const values = [rut.id_servicio, rut.id_vehiculo, rut.id_chofer, rut.nombre, rut.hora_inicio_estimada, rut.hora_fin_estimada, rut.estado, id]
        const consulta = "update rutas set id_servicio=$1, id_vehiculo=$2, id_chofer=$3, nombre=$4, hora_inicio_estimada=$5, hora_fin_estimada=$6, estado=$7 where id_ruta=$8 returning *"
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
        const consulta = await pool.query("delete from rutas where id_ruta = $1", [id]);
        if(consulta.rowCount === 0){
            throw new NotFoundError("no se pudo eliminar la ruta porque el id no existe")
        }
        return true
    }catch(error){
        errorThrower(error)
    }
}