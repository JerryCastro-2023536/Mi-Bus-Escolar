import { pool } from "../config/conexion";
import { Usuario } from "../models/usuario";


export async function listarUsuarios() {
    const resultado = await pool.query("SELECT * FROM usuarios");
    return resultado.rows;
}

export async function buscarUsuarioById(id: number) {
    const res = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
    return res.rows[0] || null;
}

export async function agregarUsuario(u: Usuario) {
    const values = [u.nombre, u.apellido, u.correo, u.password, u.telefono, u.foto_usuario, u.rol, u.correo_verificado, u.fecha_creacion, u.fecha_actualizacion]
    const query = 'INSERT INTO usuarios(nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado, fecha_creacion, fecha_actualizacion) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
    const res = await pool.query(query, values);
    return res.rows[0];
}

export async function editarUsuarioById(id: number, u: Usuario) {
    const values = [u.nombre, u.apellido, u.correo, u.password, u.telefono, u.foto_usuario, u.rol, u.correo_verificado, u.fecha_creacion, u.fecha_actualizacion]
    const query = 'UPDATE usuarios SET nombre = $1, apellido = $2, correo = $3, password = $4, telefono = $5, foto_usuario = $6, rol = $7, correo_verificado = $8, fecha_actualizacion = $9WHERE id = $10 RETURNING *';
    const res = await pool.query(query, values);
    return res.rows[0] || null;
}

export async function eliminarUsuarioById(id: number) {
    const res = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id])
    return (res.rowCount ?? 0) > 0
}
