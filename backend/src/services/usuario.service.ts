import { pool } from "../config/conexion";
import { InternalError } from "../errors/500.error";
import { DatabaseError } from "../errors/database.error";
import { NotFoundError } from "../errors/notFound.error";

import { Usuario } from "../models/usuario";

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
        const values = [u.nombre, u.apellido, u.correo, u.password, u.telefono, u.foto_usuario, u.rol, u.correo_verificado];
        const query = 'INSERT INTO Usuarios(nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function editarUsuarioById(id: number, u: Usuario) {
    try {
        const values = [u.nombre, u.apellido, u.correo, u.password, u.telefono, u.foto_usuario, u.rol, u.correo_verificado, id];
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

function errorThrower(error: any) {
    if (error.statusCode || error instanceof DatabaseError || error instanceof InternalError || error instanceof NotFoundError) {
        throw error;
    }

    if (typeof error === 'object' && error !== null && 'code' in error) {
        let campo = error.constraint;
        
        // UNIQUE
        if (error.code === '23505') {
            if (campo === "usuarios_correo_key"){
                throw new DatabaseError("Error en la base de datos", "El correo que ingresó ya existe");
            }
            if (campo === "usuarios_telefono_key"){
                throw new DatabaseError("Error en la base de datos", "El telefono que ingresó ya existe");
            }
        }

        /* CONSTRAINT FOREIGN KEY
        if (error.code === '23503') {
            throw new DatabaseError("Restricción de datos", "No se puede eliminar el usuario porque tiene registros asociados.");
        }*/
    }
    
    throw new InternalError();
}