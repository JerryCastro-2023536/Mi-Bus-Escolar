import { pool } from "../config/Conexion";
import { NotFoundError } from "../errors/notFound.error";
import { Paradas } from "../models/Paradas";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarParadas() {
    try{
        const resultado = await pool.query("SELECT * FROM paradas");
        return resultado.rows;
    }catch(error){
        errorThrower(error);
    }
    
}

export async function agregarParadas(p_paradas : Paradas){
    try{
        const valores = [p_paradas.nombre, p_paradas.direccion, p_paradas.latitud, p_paradas.longitud];
        const consulta = `INSERT INTO paradas(nombre, direccion, latitud, longitud) VALUES ($1, $2, $3, $4)`
        const resultado = await pool.query(consulta, valores);
        return resultado.rows[0];
    }catch(error){
        errorThrower(error);
    }
}

export async function buscarParadaPorId(id : number){
    try{
        const valor = [id];
        const resultado = await pool.query("SELECT * FROM paradas WHERE id_parada = $1", valor);

        if(!resultado.rows[0]){
            throw new NotFoundError(`La parada con ID ${id} no fue encontrado.`)
        }
        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function actualizarParada(p_paradas : Paradas, id: number){
    try{
        const valores = [p_paradas.nombre, p_paradas.direccion, p_paradas.latitud, p_paradas.longitud, id];
        const consulta = `UPDATE paradas SET nombre = $1, direccion = $2, latitud = $3, longitud = $4 WHERE id_parada = $5`; 
        const resultado = await pool.query(consulta, valores);

        if(!resultado.rows[0]){
            throw new NotFoundError(`La parada con ID ${id} no fue encontrado.`)
        }
        return resultado.rows[0];
    }catch(error){
        errorThrower(error);
    }
}

export async function eliminarParada(id : number) {
    try{
        const valor = [id];
        const resultado = await pool.query("DELETE FROM paradas WHERE id_parada = $1", valor);

        if(resultado.rowCount === 0){
            throw new NotFoundError(`La parada con ID ${id} no fue encontrado.`)
        }

        return true;
    }catch(error){
        errorThrower(error);
    }

    
}