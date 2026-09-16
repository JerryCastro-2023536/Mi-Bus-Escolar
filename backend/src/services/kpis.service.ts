import { pool } from "../config/conexion";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function obtenerKpisUsuarios() {
    try {
        const res = await pool.query("SELECT * FROM sp_usuarios_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}
