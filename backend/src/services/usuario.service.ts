import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { ValidationError } from "../errors/validation.error";
import bcrypt from 'bcryptjs';
import { Usuario, UsuarioLoginDTO, UsuarioRegisterDTO } from "../models/usuario";
import { errorThrower } from "../utils/middleware/errorThrower";
import { userRol } from "../enums/userRol";

export async function listarUsuarios() {
    try {
        const resultado = await pool.query("SELECT * FROM sp_usuarios_listar()");
        return resultado.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarUsuarioById(id: number) {
    try {
        const res = await pool.query('SELECT * FROM sp_usuarios_buscar_por_id($1)', [id]);

        const usuario = res.rows[0];
        delete usuario.password;

        if (usuario.rol === 'CHOFER') {
            const userId = usuario.id_usuario || usuario.id;
            const choferRes = await pool.query('SELECT id_chofer FROM Choferes WHERE id_usuario = $1 LIMIT 1', [userId]);
            if (choferRes.rows.length > 0) {
                usuario.id_chofer = choferRes.rows[0].id_chofer;
            }
        }

        return usuario;
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarUsuario(u: Usuario) {
    try {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const values = [u.nombre, u.apellido, u.correo, hashedPassword, u.telefono, u.foto_usuario, u.rol, u.correo_verificado];
        const query = 'SELECT * FROM sp_usuarios_agregar($1, $2, $3, $4, $5, $6, $7, $8)';
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
        const query = 'SELECT * FROM sp_usuarios_actualizar($1, $2, $3, $4, $5, $6, $7, $8, $9)';
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
        const res = await pool.query('SELECT sp_usuarios_eliminar($1) AS eliminadas', [id]);

        if (res.rows[0].eliminadas === 0) {
            throw new NotFoundError(`No se puede eliminar: El usuario con ID ${id} no existe.`);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}

export async function login(u: UsuarioLoginDTO) {
    try {
        const correo = u.correo.trim().toLowerCase();
        const res = await pool.query(
            'SELECT * FROM sp_usuarios_buscar_por_correo($1)',
            [correo]
        );

        if (res.rowCount === 0) {
            throw new ValidationError("Error al iniciar sesión", [{
                campo: "correo",
                mensaje: "El correo no está registrado"
            }]);
        }

        const usuario = res.rows[0];
        const hashGuardado = String(usuario.password ?? '');

        // bcrypt.compare recibe la contraseña en texto plano y el hash
        // almacenado. Nunca se vuelve a hashear la contraseña del login.
        const esHashBcrypt = /^\$2[aby]\$\d{2}\$/.test(hashGuardado);
        if (!esHashBcrypt) {
            throw new ValidationError("Error al iniciar sesión", [{
                campo: "password",
                mensaje: "La contraseña almacenada para esta cuenta debe restablecerse"
            }]);
        }

        const passwordValida = await bcrypt.compare(u.password, hashGuardado);

        if (!passwordValida) {
            throw new ValidationError("Error al iniciar sesión", [{
                campo: "password",
                mensaje: "La contraseña es inválida"
            }]);
        }

        delete usuario.password;

        if (usuario.rol === 'CHOFER') {
            const userId = usuario.id_usuario || usuario.id;
            const choferRes = await pool.query(
                'SELECT id_chofer FROM Choferes WHERE id_usuario = $1 LIMIT 1',
                [userId]
            );
            if (choferRes.rows.length > 0) {
                usuario.id_chofer = choferRes.rows[0].id_chofer;
            }
        }

        return usuario;

    } catch (error) {
        errorThrower(error);
    }
}

export async function register(u: UsuarioRegisterDTO) {
    try {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const values = [u.nombre, u.apellido, u.correo.trim().toLowerCase(), hashedPassword, u.telefono, u.foto_usuario, userRol.USUARIO, false];
        const query = 'SELECT * FROM sp_usuarios_agregar($1, $2, $3, $4, $5, $6, $7, $8)';
        const res = await pool.query(query, values);

        return res.rows[0];
    } catch (error) {
        console.log(error);
        errorThrower(error);
    }
}

export async function cambiarPassword(id: number, newPassword: string, oldPassword: string){
    try {
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        const res = await pool.query('SELECT * FROM sp_usuarios_buscar_por_id($1)', [id]);
        if (!res.rows[0]) {
            throw new NotFoundError(`El usuario con ID ${id} no fue encontrado.`);
        }
        const usuario = res.rows[0];

        const passwordValida = await bcrypt.compare(oldPassword, usuario.password);
        
        if (!passwordValida) {
            throw new ValidationError("Error al cambiar contraseña", [{
                campo: "oldPassword",
                mensaje: "La contraseña actual es inválida"
            }]);
        }
        
        const editRes = await pool.query(`SELECT * FROM sp_usuarios_editarPassword($1, $2)`, [newHashedPassword, id]);
        const usuarioEditado = editRes.rows[0];
        
        if (usuarioEditado) {
            delete usuarioEditado.password;
        }

        return usuarioEditado;
    } catch (error) {
        console.log(error);
        errorThrower(error);
    }
}