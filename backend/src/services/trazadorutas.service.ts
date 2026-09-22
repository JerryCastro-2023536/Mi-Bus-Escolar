import { pool } from "../config/conexion";

export class ViajesService {

  // 0. Obtener id_chofer a partir del id_usuario autenticado
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

  // 1. Obtener la ruta asignada del chofer usando la base de datos
  static async obtenerViajeDelDia(idChofer: number) {
    const idChoferNum = Number(idChofer) || 1;

    // 1.1 Buscar si hay un viaje ACTIVO registrado en la base de datos
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

    // 1.2 Si no hay viaje activo, buscar la ruta asignada en la tabla Rutas de PostgreSQL
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

  // 2. Obtener solo las coordenadas de la ruta específica en orden desde PostgreSQL
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

  // 2.1 Obtener trazado filtrado únicamente con las paradas de estudiantes PRESENTES
  static async obtenerTrazadoRutaPorAsistencia(idRuta: number, idViaje: number, tipo: 'IDA' | 'VUELTA' = 'IDA') {
    const query = `
      SELECT p.latitud::float AS lat, p.longitud::float AS lng, rp.orden_parada
      FROM Ruta_Parada rp
      INNER JOIN Paradas p ON rp.id_parada = p.id_parada
      WHERE rp.id_ruta = $1
        AND (
          rp.orden_parada = (SELECT MIN(orden_parada) FROM Ruta_Parada WHERE id_ruta = $1)
          OR rp.orden_parada = (SELECT MAX(orden_parada) FROM Ruta_Parada WHERE id_ruta = $1)
          OR p.id_parada IN (
            SELECT (CASE WHEN $3 = 'VUELTA' THEN ar.id_parada_descenso ELSE ar.id_parada_recogida END)
            FROM Asistencias a
            INNER JOIN Asignaciones_Ruta ar ON ar.id_estudiante = a.id_estudiante AND ar.id_ruta = $1
            WHERE a.id_viaje = $2 AND a.estado_abordaje = 'PRESENTE'
          )
        )
      ORDER BY rp.orden_parada ASC;
    `;
    const { rows } = await pool.query(query, [idRuta, idViaje, tipo]);
    if (rows.length >= 2) {
      return tipo === 'VUELTA' ? rows.reverse() : rows;
    }
    const base = await this.obtenerTrazadoRuta(idRuta);
    return tipo === 'VUELTA' ? [...base].reverse() : base;
  }

  // 3. Generar SIEMPRE un NUEVO viaje por cada "Iniciar Viaje" (solo para IDA)
  static async iniciarViaje(idChofer: number) {
    // Finalizar cualquier viaje previo activo antes de iniciar uno nuevo
    await pool.query(
      `UPDATE Viajes SET estado = 'FINALIZADO', hora_fin = CURRENT_TIME 
       WHERE id_chofer = $1 AND estado = 'ACTIVO'`,
      [idChofer]
    );

    // Buscar la ruta del chofer
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

    // Crear SIEMPRE un viaje nuevo
    const res = await pool.query(
      `INSERT INTO Viajes (id_ruta, id_chofer, id_vehiculo, fecha_viaje, hora_inicio, estado)
       VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_TIME, 'ACTIVO') RETURNING *`,
      [ruta.id_ruta, idChofer || ruta.id_chofer || 1, ruta.id_vehiculo]
    );
    const viaje = res.rows[0];

    // Crear registros PENDIENTE de asistencia para los estudiantes de la ruta
    await pool.query(
      `INSERT INTO Asistencias (id_viaje, id_estudiante, estado_abordaje)
       SELECT $1, id_estudiante, 'PENDIENTE' FROM Asignaciones_Ruta WHERE id_ruta = $2
       ON CONFLICT (id_viaje, id_estudiante) DO NOTHING`,
      [viaje.id_viaje, ruta.id_ruta]
    );

    return { ...viaje, nombre: ruta.nombre };
  }

  // 4. Finalizar el viaje al completar las paradas
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

    return viaje || { estado: 'FINALIZADO' };
  }

  // 5. Guardar la telemetría del GPS
  static async registrarUbicacion(idViaje: number, lat: number, lng: number) {
    await pool.query(
      `INSERT INTO Ubicaciones_Bus (id_viaje, latitud, longitud, fecha_hora) VALUES ($1, $2, $3, NOW())`,
      [idViaje, lat, lng]
    );
    return true;
  }

  // 6. Estudiantes de la ruta del chofer con su asistencia
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

  // 7. Marcar abordaje PRESENTE (Asistió) y notificar al tutor
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

    // Enviar notificación al tutor del estudiante (Asistió) solo si no se ha enviado aún para este viaje
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

  // 8. Marcar descenso PRESENTE y notificar al tutor
  static async marcarDescenso(idViaje: number, idEstudiante: number) {
    const timestampNow = new Date();
    const { rows } = await pool.query(
      `UPDATE Asistencias SET estado_descenso = 'PRESENTE', hora_descenso = $3
       WHERE id_viaje = $1 AND id_estudiante = $2 RETURNING *`,
      [idViaje, idEstudiante, timestampNow]
    );
    const asistencia = rows[0];

    // Enviar notificación al tutor del estudiante (Descenso) solo si no se ha enviado aún para este viaje
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

  // 9. Marcar estudiante como AUSENTE (No asistió) y notificar al tutor
  static async marcarAusente(idViaje: number, idEstudiante: number) {
    const timestampNow = new Date();
    const { rows } = await pool.query(
      `INSERT INTO Asistencias (id_viaje, id_estudiante, estado_abordaje)
       VALUES ($1, $2, 'AUSENTE')
       ON CONFLICT (id_viaje, id_estudiante)
       DO UPDATE SET estado_abordaje = 'AUSENTE'
       RETURNING *`,
      [idViaje, idEstudiante]
    );
    const asistencia = rows[0];

    // Enviar notificación al tutor del estudiante (No Asistió / Inasistencia) solo si no se ha enviado aún
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


