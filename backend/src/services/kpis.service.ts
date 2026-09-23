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

export async function obtenerKpisAsignacionesRuta() {
    try {
        const res = await pool.query("SELECT * FROM sp_asignaciones_ruta_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisAsistencias() {
    try {
        const res = await pool.query("SELECT * FROM sp_asistencias_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisChoferes() {
    try {
        const res = await pool.query("SELECT * FROM sp_choferes_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisColegios() {
    try {
        const res = await pool.query("SELECT * FROM sp_colegios_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisEstudiantes() {
    try {
        const res = await pool.query("SELECT * FROM sp_estudiantes_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisIncidencias() {
    try {
        const res = await pool.query("SELECT * FROM sp_incidencias_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisNotificaciones() {
    try {
        const res = await pool.query("SELECT * FROM sp_notificaciones_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisPagos() {
    try {
        const res = await pool.query("SELECT * FROM sp_pagos_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisParadas() {
    try {
        const res = await pool.query("SELECT * FROM sp_paradas_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisProveedores() {
    try {
        const res = await pool.query("SELECT * FROM sp_proveedores_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisRutaParada() {
    try {
        const res = await pool.query("SELECT * FROM sp_ruta_parada_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisRutas() {
    try {
        const res = await pool.query("SELECT * FROM sp_rutas_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisServicios() {
    try {
        const res = await pool.query("SELECT * FROM sp_servicios_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisUbicacionesBus() {
    try {
        const res = await pool.query("SELECT * FROM sp_ubicaciones_bus_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisValoraciones() {
    try {
        const res = await pool.query("SELECT * FROM sp_valoraciones_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisVehiculos() {
    try {
        const res = await pool.query("SELECT * FROM sp_vehiculos_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function obtenerKpisViajes() {
    try {
        const res = await pool.query("SELECT * FROM sp_viajes_kpis()");
        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}