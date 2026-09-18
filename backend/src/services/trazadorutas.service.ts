import { pool } from "../config/conexion";

export class ViajesService {

  // 1. Obtener la ruta del chofer y consultar si ya existe un viaje ACTIVO hoy (para mantener estado al recargar)
  static async obtenerViajeDelDia(idChofer: number) {
    const queryRuta = `
      SELECT r.id_ruta, r.nombre, r.hora_inicio_estimada, r.hora_fin_estimada, r.id_vehiculo, r.id_chofer
      FROM Rutas r
      WHERE r.id_chofer = $1 AND r.estado = 'ACTIVO'
      LIMIT 1;
    `;
    let resRuta = await pool.query(queryRuta, [idChofer]);
    let rutaInfo = resRuta.rows[0] || null;

    if (!rutaInfo) {
      const queryFallback = `
        SELECT r.id_ruta, r.nombre, r.hora_inicio_estimada, r.hora_fin_estimada, r.id_vehiculo, r.id_chofer
        FROM Rutas r
        WHERE r.id_chofer = $1
        LIMIT 1;
      `;
      const resFallback = await pool.query(queryFallback, [idChofer]);
      rutaInfo = resFallback.rows[0] || null;
    }

    if (!rutaInfo) {
      return null;
    }

    // Comprobar si ya existe un viaje ACTIVO hoy para mantener el estado en el frontend al recargar la página
    const queryViajeActivo = `
      SELECT v.id_viaje, v.id_ruta, v.id_chofer, v.id_vehiculo, v.fecha_viaje, v.hora_inicio, v.hora_fin, v.estado
      FROM Viajes v
      WHERE v.id_chofer = $1 AND v.fecha_viaje = CURRENT_DATE AND v.estado = 'ACTIVO'
      ORDER BY v.id_viaje DESC
      LIMIT 1;
    `;
    const resViaje = await pool.query(queryViajeActivo, [idChofer]);
    const viajeActivo = resViaje.rows[0] || null;

    if (viajeActivo) {
      return {
        id_viaje: viajeActivo.id_viaje,
        id_ruta: viajeActivo.id_ruta || rutaInfo.id_ruta,
        id_chofer: viajeActivo.id_chofer,
        id_vehiculo: viajeActivo.id_vehiculo,
        fecha_viaje: viajeActivo.fecha_viaje,
        hora_inicio: viajeActivo.hora_inicio,
        estado: 'ACTIVO',
        nombre: rutaInfo.nombre,
        hora_inicio_estimada: rutaInfo.hora_inicio_estimada,
        hora_fin_estimada: rutaInfo.hora_fin_estimada
      };
    }

    return {
      id_viaje: null,
      id_ruta: rutaInfo.id_ruta,
      id_chofer: rutaInfo.id_chofer,
      id_vehiculo: rutaInfo.id_vehiculo,
      nombre: rutaInfo.nombre,
      hora_inicio_estimada: rutaInfo.hora_inicio_estimada,
      hora_fin_estimada: rutaInfo.hora_fin_estimada,
      estado: 'SIN_INICIAR'
    };
  }

  // 2. Obtener solo las coordenadas de la ruta específica en orden
  static async obtenerTrazadoRuta(idRuta: number) {
    const query = `
      SELECT p.latitud AS lat, p.longitud AS lng 
      FROM Ruta_Parada rp
      INNER JOIN Paradas p ON rp.id_parada = p.id_parada
      WHERE rp.id_ruta = $1
      ORDER BY rp.orden_parada ASC;
    `;
    const { rows } = await pool.query(query, [idRuta]);
    return rows; // Retorna un array compatible con PuntoRuta[] de Angular
  }

  // 3. Generar un NUEVO viaje o actualizar uno programado en la BD al presionar "Iniciar Ruta"
  static async iniciarViaje(idChoferOViaje: number) {
    let idChofer = idChoferOViaje;

    // Buscar la ruta asignada al chofer
    const queryRuta = `
      SELECT id_ruta, id_vehiculo, id_chofer, nombre
      FROM Rutas
      WHERE id_chofer = $1 AND estado = 'ACTIVO'
      LIMIT 1;
    `;
    let resRuta = await pool.query(queryRuta, [idChofer]);

    if (resRuta.rows.length === 0) {
      resRuta = await pool.query(
        `SELECT id_ruta, id_vehiculo, id_chofer, nombre FROM Rutas WHERE id_chofer = $1 LIMIT 1`,
        [idChofer]
      );
    }

    if (resRuta.rows.length === 0) {
      resRuta = await pool.query(
        `SELECT id_ruta, id_vehiculo, id_chofer, nombre FROM Rutas WHERE id_ruta = $1 LIMIT 1`,
        [idChoferOViaje]
      );
    }

    if (resRuta.rows.length === 0) {
      throw new Error(`No se encontró ninguna ruta asignada al chofer con ID ${idChoferOViaje}.`);
    }

    const ruta = resRuta.rows[0];
    idChofer = ruta.id_chofer || idChoferOViaje;

    // Comprobar si ya existe un viaje para hoy de este chofer / ruta
    const checkViajeHoy = await pool.query(
      `SELECT * FROM Viajes WHERE id_chofer = $1 AND id_ruta = $2 AND fecha_viaje = CURRENT_DATE ORDER BY id_viaje DESC LIMIT 1`,
      [idChofer, ruta.id_ruta]
    );

    let viaje: any;

    if (checkViajeHoy.rows.length > 0) {
      const vExistente = checkViajeHoy.rows[0];
      // Actualizamos el viaje existente a ACTIVO y registramos hora_inicio
      const updateRes = await pool.query(
        `UPDATE Viajes SET estado = 'ACTIVO', hora_inicio = COALESCE(hora_inicio, CURRENT_TIME) WHERE id_viaje = $1 RETURNING *`,
        [vExistente.id_viaje]
      );
      viaje = updateRes.rows[0];
    } else {
      // Si no existe, insertamos un nuevo registro en Viajes
      const insertViajeQuery = `
        INSERT INTO Viajes (id_ruta, id_chofer, id_vehiculo, fecha_viaje, hora_inicio, estado)
        VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_TIME, 'ACTIVO')
        RETURNING *;
      `;
      const nuevoViajeRes = await pool.query(insertViajeQuery, [ruta.id_ruta, idChofer, ruta.id_vehiculo]);
      viaje = nuevoViajeRes.rows[0];
    }

    // Generar asistencias iniciales para los estudiantes asignados a la ruta
    const insertAsistenciasQuery = `
      INSERT INTO Asistencias (id_viaje, id_estudiante, estado_abordaje)
      SELECT $1, id_estudiante, 'PENDIENTE'
      FROM Asignaciones_Ruta
      WHERE id_ruta = $2
      ON CONFLICT (id_viaje, id_estudiante) DO NOTHING;
    `;
    await pool.query(insertAsistenciasQuery, [viaje.id_viaje, ruta.id_ruta]);

    return {
      ...viaje,
      nombre: ruta.nombre
    };
  }

  // 4. Finalizar el viaje al completar las paradas de abordaje
  static async finalizarViaje(idViaje: number) {
    const query = `
      UPDATE Viajes
      SET estado = 'FINALIZADO', hora_fin = CURRENT_TIME
      WHERE id_viaje = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [idViaje]);
    return rows[0];
  }

  // 5. Guardar la telemetría del GPS filtrada por viaje
  static async registrarUbicacion(idViaje: number, lat: number, lng: number) {
    const query = `
      INSERT INTO Ubicaciones_Bus (id_viaje, latitud, longitud, fecha_hora)
      VALUES ($1, $2, $3, NOW())
      RETURNING id_ubicacion;
    `;
    await pool.query(query, [idViaje, lat, lng]);
    return true;
  }
}

