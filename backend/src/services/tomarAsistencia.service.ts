import { pool } from "../config/conexion";
import { errorThrower } from "../utils/middleware/errorThrower";

export interface AsistenciaReporteItem {
    id_estudiante: number;
    estado_abordaje: "PRESENTE" | "AUSENTE";
}

export async function misRutas(idUsuario: number) {
    try {
        const res = await pool.query(
            "SELECT * FROM sp_asistencias_mis_rutas($1)",
            [idUsuario]
        );
        return res.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function estudiantesDeRuta(idRuta: number) {
    try {
        const res = await pool.query(
            "SELECT * FROM sp_asistencias_estudiantes_ruta($1)",
            [idRuta]
        );
        return res.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function viajeHoy(idRuta: number) {
    try {
        const res = await pool.query("SELECT * FROM sp_asistencias_viaje_hoy($1)", [idRuta]);
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function estadosViaje(idViaje: number) {
    try {
        const res = await pool.query(
            "SELECT * FROM sp_asistencias_estados_viaje($1)",
            [idViaje]
        );
        return res.rows;
    } catch (error) {
        errorThrower(error);
    }
}


export async function enviarReporte(
    idUsuario: number,
    idViaje: number,
    asistencias: AsistenciaReporteItem[]
) {
    try {
        const res = await pool.query(
            "SELECT * FROM sp_asistencias_enviar_reporte($1, $2, $3)",
            [idUsuario, idViaje, JSON.stringify(asistencias)]
        );
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function misNotificaciones(idUsuario: number) {
    try {
        const res = await pool.query(
            "SELECT * FROM sp_notificaciones_listar_usuario($1)",
            [idUsuario]
        );
        return res.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function contarNoLeidas(idUsuario: number) {
    try {
        const res = await pool.query(
            "SELECT * FROM sp_notificaciones_no_leidas($1)",
            [idUsuario]
        );
        return res.rows[0].cant;
    } catch (error) {
        errorThrower(error);
    }
}

export async function marcarNotificacionLeida(idNotificacion: number, idUsuario: number) {
    try {
        const res = await pool.query(
            "SELECT * FROM sp_notificaciones_marcar_leida($1, $2)",
            [idNotificacion, idUsuario]
        );
        return res.rows[0].ok;
    } catch (error) {
        errorThrower(error);
    }
}
