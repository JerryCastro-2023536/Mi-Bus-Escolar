import { pool } from "../config/conexion";
import { Usuario } from "../models/usuario";


export async function listarUsuarios() {
    const resultado = await pool.query("SELECT * FROM Usuarios");
    return resultado.rows;
}

export async function buscarUsuarioById(id: number) {
    const res = await pool.query('SELECT * FROM Usuarios WHERE id_usuario = $1', [id]);
    return res.rows[0] || null;
}

export async function agregarUsuario(u: Usuario) {
    const values = [u.nombre, u.apellido, u.correo, u.password, u.telefono, u.foto_usuario, u.rol, u.correo_verificado]
    const query = 'INSERT INTO Usuarios(nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *'
    const res = await pool.query(query, values);
    return res.rows[0];
}

export async function editarUsuarioById(id: number, u: Usuario) {
    const values = [u.nombre, u.apellido, u.correo, u.password, u.telefono, u.foto_usuario, u.rol, u.correo_verificado, id]
    const query = 'UPDATE Usuarios SET nombre = $1, apellido = $2, correo = $3, password = $4, telefono = $5, foto_usuario = $6, rol = $7, correo_verificado = $8 WHERE id_usuario = $9 RETURNING *';
    const res = await pool.query(query, values);
    return res.rows[0] || null;
}

export async function eliminarUsuarioById(id: number) {
    const res = await pool.query('DELETE FROM Usuarios WHERE id_usuario = $1', [id])
    return (res.rowCount ?? 0) > 0
}
