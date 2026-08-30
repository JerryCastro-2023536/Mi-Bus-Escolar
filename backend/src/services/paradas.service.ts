import { pool } from "../config/Conexion";
import { Paradas } from "../models/Paradas";

export async function listarParadas() {
    const resultado = await pool.query("SELECT * FROM paradas");
    return resultado.rows;
}

export async function agregarParadas(p_paradas : Paradas){
    const valores = [p_paradas.nombre, p_paradas.direccion, p_paradas.latitud, p_paradas.longitud];
    const consulta = `INSERT INTO paradas(nombre, direccion, latitud, longitud) VALUES ($1, $2, $3, $4)`
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function buscarParadaPorId(id : number){
    const valor = [id];
    const resultado = await pool.query("SELECT * FROM paradas WHERE id_parada = $1", valor);
    return resultado.rows[0];
}

export async function actualizarParada(p_paradas : Paradas, id: number){
    const valores = [p_paradas.nombre, p_paradas.direccion, p_paradas.latitud, p_paradas.longitud];
    const consulta = `UPDATE paradas SET nombre = $1, direccion = $2, latitud = $3, longitud = $4 WHERE id_parada = $5`; 
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function eliminarParada(id : number) {
    const valor = [id];
    const resultado = await pool.query("DELETE FROM paradas WHERE id_parada = $1", valor);
    console.log("Eliminado correctamente");
}