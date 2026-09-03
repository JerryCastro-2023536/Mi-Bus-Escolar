import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { ValidationError } from "../errors/validation.error";
import bcrypt from 'bcryptjs';
import { Usuario, UsuarioLoginDTO } from "../models/usuario";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarUsuarios() {
    try {
        const resultado = await pool.query("SELECT * FROM Usuarios");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarUsuarioById(id: number) {
    try {
        const res = await pool.query('SELECT * FROM Usuarios WHERE id_usuario = $1', [id]);

        if (!res.rows[0]) {
            throw new NotFoundError(`El usuario con ID ${id} no fue encontrado.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarUsuario(u: Usuario) {
    try {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const values = [u.nombre, u.apellido, u.correo, hashedPassword, u.telefono, u.foto_usuario, u.rol, u.correo_verificado];
        const query = 'INSERT INTO Usuarios(nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarUsuarioById(id: number, u: Usuario) {
    try {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const values = [u.nombre, u.apellido, u.correo, hashedPassword, u.telefono, u.foto_usuario, u.rol, u.correo_verificado, id];
        const query = 'UPDATE Usuarios SET nombre = $1, apellido = $2, correo = $3, password = $4, telefono = $5, foto_usuario = $6, rol = $7, correo_verificado = $8 WHERE id_usuario = $9 RETURNING *';
        const res = await pool.query(query, values);

        if (!res.rows[0]) {
            throw new NotFoundError(`No se puede editar: El usuario con ID ${id} no existe.`);
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarUsuarioById(id: number) {
    try {
        const res = await pool.query('DELETE FROM Usuarios WHERE id_usuario = $1', [id]);

        if (res.rowCount === 0) {
            throw new NotFoundError(`No se puede eliminar: El usuario con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}

export async function login(u: UsuarioLoginDTO) {
    try {
        const res = await pool.query('SELECT * FROM Usuarios WHERE correo = $1', [u.correo]);
        if (res.rowCount === 0) {
            throw new ValidationError("Error al logearse", [{
                campo: "correo",
                mensaje: "El correo es invalido"
            }]);
        }

        const usuario = res.rows[0];
        const passwordValida = await bcrypt.compare(u.password, usuario.password);

        if (!passwordValida) {
            throw new ValidationError("Error al logearse", [{
                campo: "password",
                mensaje: "La contraseña es invalida"
            }]);
        }
        delete usuario.password;

        return usuario;

    } catch (error) {
        errorThrower(error);
    }
}
