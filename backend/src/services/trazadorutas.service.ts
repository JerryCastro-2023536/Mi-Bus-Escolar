import { pool } from "../config/conexion";

const trazadosActivosMap = new Map<number, { lat: number; lng: number }[]>();

export class ViajesService {

  static guardarTrazadoActivo(idViaje: number, puntos: { lat: number; lng: number }[]) {
    if (idViaje && Array.isArray(puntos)) {
      trazadosActivosMap.set(Number(idViaje), puntos);
    }
  }

  static obtenerTrazadoActivo(idViaje: number) {
    return trazadosActivosMap.get(Number(idViaje)) || null;
  }

  static async obtenerTrazadoActivoAsync(idViaje: number, idRuta?: number) {
    const enMemoria = trazadosActivosMap.get(Number(idViaje));
    if (enMemoria && enMemoria.length > 0) {
      return enMemoria;
    }
    if (idRuta) {
      return this.obtenerTrazadoRutaPorAsistencia(Number(idRuta), Number(idViaje));
    }
    return [];
  }

  static async obtenerChoferPorUsuario(idUsuario: number) {
    const { rows } = await pool.query(
      `SELECT id_chofer FROM Choferes WHERE id_usuario = $1 LIMIT 1`,
      [Number(idUsuario) || 1]
    );
    if (rows.length > 0) {
      return rows[0];
    }
    const fallback = await pool.query(`SELECT id_chofer FROM Choferes ORDER BY id_chofer ASC LIMIT 1`);
    return fallback.rows[0] ?? { id_chofer: 1 };
  }

  static async obtenerViajeDelDia(idChofer: number) {
    const idChoferNum = Number(idChofer) || 1;

    const queryActivo = `
      SELECT v.id_viaje, v.id_ruta, v.id_chofer, v.id_vehiculo, v.fecha_viaje, v.hora_inicio, v.hora_fin, v.estado,
             r.nombre, r.hora_inicio_estimada, r.hora_fin_estimada
      FROM Viajes v
      INNER JOIN Rutas r ON r.id_ruta = v.id_ruta
      WHERE v.id_chofer = $1 AND v.estado = 'ACTIVO'
      ORDER BY v.id_viaje DESC
      LIMIT 1;
    `;
    const resActivo = await pool.query(queryActivo, [idChoferNum]);
    if (resActivo.rows.length > 0) {
      const v = resActivo.rows[0];
      return {
        id_viaje: v.id_viaje,
        id_ruta: v.id_ruta,
        id_chofer: v.id_chofer,
        id_vehiculo: v.id_vehiculo,
        fecha_viaje: v.fecha_viaje,
        hora_inicio: v.hora_inicio,
        estado: 'ACTIVO',
        nombre: v.nombre,
        hora_inicio_estimada: v.hora_inicio_estimada,
        hora_fin_estimada: v.hora_fin_estimada
      };
    }

    let resRuta = await pool.query(`
      SELECT id_ruta, id_chofer, id_vehiculo, nombre, hora_inicio_estimada, hora_fin_estimada
      FROM Rutas
      WHERE id_chofer = $1 AND estado = 'ACTIVO'
      LIMIT 1;
    `, [idChoferNum]);

    if (resRuta.rows.length === 0) {
      resRuta = await pool.query(`
        SELECT id_ruta, id_chofer, id_vehiculo, nombre, hora_inicio_estimada, hora_fin_estimada
        FROM Rutas
        WHERE estado = 'ACTIVO'
        ORDER BY id_ruta ASC
        LIMIT 1;
      `);
    }

    if (resRuta.rows.length === 0) {
      return null;
    }

    const r = resRuta.rows[0];
    return {
      id_viaje: null,
      id_ruta: r.id_ruta,
      id_chofer: r.id_chofer || idChoferNum,
      id_vehiculo: r.id_vehiculo,
      nombre: r.nombre,
      hora_inicio_estimada: r.hora_inicio_estimada,
      hora_fin_estimada: r.hora_fin_estimada,
      estado: 'SIN_INICIAR'
    };
  }

  static async obtenerTrazadoRuta(idRuta: number) {
    const query = `
      SELECT p.latitud::float AS lat, p.longitud::float AS lng 
      FROM Ruta_Parada rp
      INNER JOIN Paradas p ON rp.id_parada = p.id_parada
      WHERE rp.id_ruta = $1
      ORDER BY rp.orden_parada ASC;
    `;
    const { rows } = await pool.query(query, [idRuta]);
    return rows;
  }

  static async obtenerTrazadoRutaPorAsistencia(idRuta: number, idViaje: number, tipo: 'IDA' | 'VUELTA' = 'IDA') {
    const baseStopsQuery = `
      SELECT p.id_parada, p.latitud::float AS lat, p.longitud::float AS lng, rp.orden_parada
      FROM Ruta_Parada rp
      INNER JOIN Paradas p ON rp.id_parada = p.id_parada
      WHERE rp.id_ruta = $1
      ORDER BY rp.orden_parada ASC;
    `;
    const { rows: baseStops } = await pool.query(baseStopsQuery, [idRuta]);
    if (baseStops.length === 0) return [];

    const ausentesQuery = `
      SELECT DISTINCT 
        ar.id_parada_recogida,
        ar.id_parada_descenso
      FROM Asistencias a
      INNER JOIN Asignaciones_Ruta ar ON ar.id_estudiante = a.id_estudiante AND ar.id_ruta = $1
      WHERE a.id_viaje = $2 
        AND (
          ($3 = 'IDA' AND a.estado_abordaje = 'AUSENTE')
          OR ($3 = 'VUELTA' AND (a.estado_descenso = 'AUSENTE' OR a.estado_abordaje = 'AUSENTE'))
        );
    `;
    const ausentesRes = await pool.query(ausentesQuery, [idRuta, idViaje, tipo]);
    const paradasAusentes = new Set<number>();
    for (const row of ausentesRes.rows) {
      if (row.id_parada_recogida) paradasAusentes.add(Number(row.id_parada_recogida));
      if (row.id_parada_descenso) paradasAusentes.add(Number(row.id_parada_descenso));
    }

    const presentesQuery = `
      SELECT DISTINCT 
        ar.id_parada_recogida,
        ar.id_parada_descenso
      FROM Asistencias a
      INNER JOIN Asignaciones_Ruta ar ON ar.id_estudiante = a.id_estudiante AND ar.id_ruta = $1
      WHERE a.id_viaje = $2 
        AND (
          ($3 = 'IDA' AND a.estado_abordaje = 'PRESENTE')
          OR ($3 = 'VUELTA' AND (a.estado_descenso = 'PRESENTE' OR a.estado_abordaje = 'PRESENTE'))
        );
    `;
    const presentesRes = await pool.query(presentesQuery, [idRuta, idViaje, tipo]);
    const paradasPresentes = new Set<number>();
    for (const row of presentesRes.rows) {
      if (row.id_parada_recogida) paradasPresentes.add(Number(row.id_parada_recogida));
      if (row.id_parada_descenso) paradasPresentes.add(Number(row.id_parada_descenso));
    }

    const minOrden = baseStops[0].orden_parada;
    const maxOrden = baseStops[baseStops.length - 1].orden_parada;

    let paradasFiltradas = baseStops.filter(p => {
      if (p.orden_parada === minOrden || p.orden_parada === maxOrden) {
        return true;
      }

      if (tipo === 'VUELTA' && paradasPresentes.size > 0) {
        return paradasPresentes.has(p.id_parada);
      }

      if (paradasPresentes.size > 0) {
        return paradasPresentes.has(p.id_parada);
      }

      return !paradasAusentes.has(p.id_parada);
    });

    if (paradasFiltradas.length < 2) {
      paradasFiltradas = baseStops;
    }

    const resultado = paradasFiltradas.map(p => ({ lat: p.lat, lng: p.lng }));
    return tipo === 'VUELTA' ? resultado.slice().reverse() : resultado;
  }

  static async iniciarViaje(idChofer: number) {
    await pool.query(
      `UPDATE Viajes SET estado = 'FINALIZADO', hora_fin = CURRENT_TIME 
       WHERE id_chofer = $1 AND estado = 'ACTIVO'`,
      [idChofer]
    );

    let resRuta = await pool.query(
      `SELECT id_ruta, id_vehiculo, id_chofer, nombre FROM Rutas WHERE id_chofer = $1 LIMIT 1`,
      [idChofer]
    );
    if (resRuta.rows.length === 0) {
      resRuta = await pool.query(
        `SELECT id_ruta, id_vehiculo, id_chofer, nombre FROM Rutas LIMIT 1`
      );
    }
    if (resRuta.rows.length === 0) {
      throw new Error(`No se encontró ninguna ruta disponible.`);
    }
    const ruta = resRuta.rows[0];

    const res = await pool.query(
      `INSERT INTO Viajes (id_ruta, id_chofer, id_vehiculo, fecha_viaje, hora_inicio, estado)
       VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_TIME, 'ACTIVO') RETURNING *`,
      [ruta.id_ruta, idChofer || ruta.id_chofer || 1, ruta.id_vehiculo]
    );
    const viaje = res.rows[0];

    await pool.query(
      `INSERT INTO Asistencias (id_viaje, id_estudiante, estado_abordaje)
       SELECT $1, id_estudiante, 'PENDIENTE' FROM Asignaciones_Ruta WHERE id_ruta = $2
       ON CONFLICT (id_viaje, id_estudiante) DO NOTHING`,
      [viaje.id_viaje, ruta.id_ruta]
    );

    return { ...viaje, nombre: ruta.nombre };
  }

  static async finalizarViaje(idViaje: number) {
    const query = `
      UPDATE Viajes
      SET estado = 'FINALIZADO', hora_fin = CURRENT_TIME
      WHERE id_viaje = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [idViaje]);
    const viaje = rows[0];

    const idChofer = viaje?.id_chofer || 1;
    const idRuta = viaje?.id_ruta || 1;
    await pool.query(
      `UPDATE Viajes
       SET estado = 'FINALIZADO', hora_fin = CURRENT_TIME
       WHERE (id_chofer = $1 OR id_ruta = $2 OR id_viaje = $3) AND estado = 'ACTIVO'`,
      [idChofer, idRuta, idViaje]
    );

    trazadosActivosMap.delete(Number(idViaje));

    return viaje || { estado: 'FINALIZADO' };
  }

  static async registrarUbicacion(idViaje: number, lat: number, lng: number) {
    await pool.query(
      `INSERT INTO Ubicaciones_Bus (id_viaje, latitud, longitud, fecha_hora) VALUES ($1, $2, $3, NOW())`,
      [idViaje, lat, lng]
    );
    return true;
  }

  static async obtenerUltimaUbicacion(idViaje: number) {
    const query = `
      SELECT u.latitud::float AS latitud, u.longitud::float AS longitud, u.fecha_hora, v.estado
      FROM Viajes v
      LEFT JOIN Ubicaciones_Bus u ON u.id_viaje = v.id_viaje
      WHERE v.id_viaje = $1 AND u.latitud IS NOT NULL
      ORDER BY u.fecha_hora DESC
      LIMIT 1;
    `;
    const { rows } = await pool.query(query, [idViaje]);
    if (rows.length > 0 && rows[0].latitud !== null) {
      return rows[0];
    }

    const fallbackQuery = `
      SELECT p.latitud::float AS latitud, p.longitud::float AS longitud, NOW() AS fecha_hora, v.estado
      FROM Viajes v
      INNER JOIN Ruta_Parada rp ON rp.id_ruta = v.id_ruta
      INNER JOIN Paradas p ON p.id_parada = rp.id_parada
      WHERE v.id_viaje = $1
      ORDER BY rp.orden_parada ASC
      LIMIT 1;
    `;
    const fallbackRes = await pool.query(fallbackQuery, [idViaje]);
    return fallbackRes.rows[0] || null;
  }

  static async obtenerEstudiantesConAsistencia(idChofer: number, idViaje?: number) {
    let query: string;
    let params: any[];
    if (idViaje) {
      query = `
        SELECT
          e.id_estudiante,
          e.id_usuario_tutor,
          e.nombre,
          e.apellido,
          e.grado,
          e.foto_estudiante,
          COALESCE(a.estado_abordaje, 'PENDIENTE') AS estado_abordaje,
          a.hora_abordaje,
          a.estado_descenso,
          a.hora_descenso,
          $2::int AS id_viaje
        FROM Asignaciones_Ruta ar
        INNER JOIN Rutas r ON r.id_ruta = ar.id_ruta
        INNER JOIN Estudiantes e ON e.id_estudiante = ar.id_estudiante
        LEFT JOIN Asistencias a ON a.id_estudiante = e.id_estudiante AND a.id_viaje = $2
        WHERE r.id_chofer = $1
        ORDER BY e.apellido, e.nombre ASC;
      `;
      params = [idChofer, idViaje];
    } else {
      query = `
        SELECT
          e.id_estudiante,
          e.id_usuario_tutor,
          e.nombre,
          e.apellido,
          e.grado,
          e.foto_estudiante,
          'PENDIENTE' AS estado_abordaje,
          NULL AS hora_abordaje,
          NULL AS estado_descenso,
          NULL AS hora_descenso,
          NULL AS id_viaje
        FROM Asignaciones_Ruta ar
        INNER JOIN Rutas r ON r.id_ruta = ar.id_ruta
        INNER JOIN Estudiantes e ON e.id_estudiante = ar.id_estudiante
        WHERE r.id_chofer = $1
        ORDER BY e.apellido, e.nombre ASC;
      `;
      params = [idChofer];
    }
    let { rows } = await pool.query(query, params);

    if (rows.length === 0) {
      const fallbackQuery = `
        SELECT
          e.id_estudiante,
          e.id_usuario_tutor,
          e.nombre,
          e.apellido,
          e.grado,
          e.foto_estudiante,
          'PENDIENTE' AS estado_abordaje,
          NULL AS hora_abordaje,
          NULL AS estado_descenso,
          NULL AS hora_descenso,
          $1::int AS id_viaje
        FROM Estudiantes e
        ORDER BY e.apellido, e.nombre ASC
        LIMIT 20;
      `;
      const fallbackRes = await pool.query(fallbackQuery, [idViaje || null]);
      rows = fallbackRes.rows;
    }

    return rows;
  }

  static async marcarAbordaje(idViaje: number, idEstudiante: number) {
    const timestampNow = new Date();
    const { rows } = await pool.query(
      `INSERT INTO Asistencias (id_viaje, id_estudiante, estado_abordaje, hora_abordaje)
       VALUES ($1, $2, 'PRESENTE', $3)
       ON CONFLICT (id_viaje, id_estudiante)
       DO UPDATE SET estado_abordaje = 'PRESENTE', hora_abordaje = $3
       RETURNING *`,
      [idViaje, idEstudiante, timestampNow]
    );
    const asistencia = rows[0];

    try {
      const estRes = await pool.query(
        `SELECT id_usuario_tutor, nombre, apellido FROM Estudiantes WHERE id_estudiante = $1`,
        [idEstudiante]
      );
      const est = estRes.rows[0];
      if (est && est.id_usuario_tutor && asistencia?.id_asistencia) {
        const yaExiste = await pool.query(
          `SELECT id_notificacion FROM notificaciones 
           WHERE id_usuario = $1 AND id_asistencia = $2 AND tipo = 'ASISTENCIA' AND titulo LIKE 'Estudiante a bordo:%'
           LIMIT 1`,
          [est.id_usuario_tutor, asistencia.id_asistencia]
        );

        if (yaExiste.rows.length === 0) {
          await pool.query(
            `SELECT * FROM sp_notificaciones_agregar($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              est.id_usuario_tutor,
              null,
              asistencia.id_asistencia,
              'ASISTENCIA',
              `Estudiante a bordo: ${est.nombre} ${est.apellido}`,
              `El estudiante ${est.nombre} ${est.apellido} ha abordado el bus escolar y se encuentra en ruta.`,
              false,
              timestampNow
            ]
          );
        }
      }
    } catch (notiErr) {
      console.error('Error enviando notificación de asistencia/abordaje:', notiErr);
    }

    return asistencia;
  }

  static async marcarDescenso(idViaje: number, idEstudiante: number) {
    const timestampNow = new Date();
    const { rows } = await pool.query(
      `INSERT INTO Asistencias (id_viaje, id_estudiante, estado_descenso, hora_descenso)
       VALUES ($1, $2, 'PRESENTE', $3)
       ON CONFLICT (id_viaje, id_estudiante)
       DO UPDATE SET estado_descenso = 'PRESENTE', hora_descenso = $3
       RETURNING *`,
      [idViaje, idEstudiante, timestampNow]
    );
    const asistencia = rows[0];

    try {
      const estRes = await pool.query(
        `SELECT id_usuario_tutor, nombre, apellido FROM Estudiantes WHERE id_estudiante = $1`,
        [idEstudiante]
      );
      const est = estRes.rows[0];
      if (est && est.id_usuario_tutor && asistencia?.id_asistencia) {
        const yaExiste = await pool.query(
          `SELECT id_notificacion FROM notificaciones 
           WHERE id_usuario = $1 AND id_asistencia = $2 AND tipo = 'ASISTENCIA' AND titulo LIKE 'Descenso confirmado:%'
           LIMIT 1`,
          [est.id_usuario_tutor, asistencia.id_asistencia]
        );

        if (yaExiste.rows.length === 0) {
          await pool.query(
            `SELECT * FROM sp_notificaciones_agregar($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              est.id_usuario_tutor,
              null,
              asistencia.id_asistencia,
              'ASISTENCIA',
              `Descenso confirmado: ${est.nombre} ${est.apellido}`,
              `El estudiante ${est.nombre} ${est.apellido} ha descendido del bus escolar en su destino.`,
              false,
              timestampNow
            ]
          );
        }
      }
    } catch (notiErr) {
      console.error('Error enviando notificación de descenso:', notiErr);
    }

    return asistencia;
  }

  static async marcarAusente(idViaje: number, idEstudiante: number) {
    const timestampNow = new Date();
    const { rows } = await pool.query(
      `INSERT INTO Asistencias (id_viaje, id_estudiante, estado_abordaje, estado_descenso)
       VALUES ($1, $2, 'AUSENTE', 'AUSENTE')
       ON CONFLICT (id_viaje, id_estudiante)
       DO UPDATE SET estado_abordaje = 'AUSENTE', estado_descenso = 'AUSENTE'
       RETURNING *`,
      [idViaje, idEstudiante]
    );
    const asistencia = rows[0];

    try {
      const estRes = await pool.query(
        `SELECT id_usuario_tutor, nombre, apellido FROM Estudiantes WHERE id_estudiante = $1`,
        [idEstudiante]
      );
      const est = estRes.rows[0];
      if (est && est.id_usuario_tutor && asistencia?.id_asistencia) {
        const yaExiste = await pool.query(
          `SELECT id_notificacion FROM notificaciones 
           WHERE id_usuario = $1 AND id_asistencia = $2 AND tipo = 'INASISTENCIA'
           LIMIT 1`,
          [est.id_usuario_tutor, asistencia.id_asistencia]
        );

        if (yaExiste.rows.length === 0) {
          await pool.query(
            `SELECT * FROM sp_notificaciones_agregar($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              est.id_usuario_tutor,
              null,
              asistencia.id_asistencia,
              'INASISTENCIA',
              `Inasistencia registrada: ${est.nombre} ${est.apellido}`,
              `Se ha registrado que el estudiante ${est.nombre} ${est.apellido} no asistió / no abordó la unidad en esta ruta.`,
              false,
              timestampNow
            ]
          );
        }
      }
    } catch (notiErr) {
      console.error('Error enviando notificación de inasistencia:', notiErr);
    }

    return asistencia;
  }
}


