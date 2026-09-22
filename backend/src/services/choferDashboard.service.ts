import { pool } from "../config/conexion";

export async function obtenerVehiculosPorChofer(idChofer: number) {
  const query = `
    SELECT
      v.id_vehiculo,
      v.placa,
      v.foto_vehiculo,
      v.estado,
      p.nombre_negocio AS proveedor,
      STRING_AGG(DISTINCT r.nombre, ', ') AS ruta_asignada
    FROM Vehiculos v
    LEFT JOIN Proveedores p ON p.id_proveedor = v.id_proveedor
    LEFT JOIN Rutas r ON r.id_vehiculo = v.id_vehiculo
    WHERE r.id_chofer = $1 OR r.id_chofer = (SELECT id_chofer FROM Choferes WHERE id_usuario = $1 LIMIT 1)
    GROUP BY v.id_vehiculo, v.placa, v.foto_vehiculo, v.estado, p.nombre_negocio
    ORDER BY v.placa ASC;
  `;

  const result = await pool.query(query, [idChofer]);
  return result.rows;
}

export async function obtenerEstudiantesPorChofer(idChofer: number) {
  const query = `
    SELECT
      e.id_estudiante,
      e.id_usuario_tutor,
      e.nombre,
      e.apellido,
      e.grado,
      e.foto_estudiante,
      c.nombre AS colegio,
      r.nombre AS ruta_asignada,
      u.telefono AS tutor_telefono,
      CONCAT(u.nombre, ' ', u.apellido) AS tutor_nombre
    FROM Asignaciones_Ruta ar
    INNER JOIN Rutas r ON r.id_ruta = ar.id_ruta
    INNER JOIN Estudiantes e ON e.id_estudiante = ar.id_estudiante
    LEFT JOIN Colegios c ON c.id_colegio = e.id_colegio
    LEFT JOIN Usuarios u ON u.id_usuario = e.id_usuario_tutor
    WHERE r.id_chofer = $1 OR r.id_chofer = (SELECT id_chofer FROM Choferes WHERE id_usuario = $1 LIMIT 1)
    GROUP BY e.id_estudiante, e.id_usuario_tutor, e.nombre, e.apellido, e.grado, e.foto_estudiante, c.nombre, r.nombre, u.telefono, u.nombre, u.apellido
    ORDER BY e.apellido, e.nombre ASC;
  `;

  const result = await pool.query(query, [idChofer]);
  return result.rows;
}

export async function obtenerReportesPorChofer(idChofer: number) {
  const query = `
    SELECT DISTINCT
      i.id_incidencia,
      i.titulo,
      i.descripcion,
      i.estado,
      i.fecha_hora,
      i.latitud,
      i.longitud,
      r.nombre AS ruta
    FROM Incidencias i
    LEFT JOIN Rutas r ON r.id_ruta = i.id_ruta
    LEFT JOIN Choferes ch ON (ch.id_chofer = $1 OR ch.id_usuario = $1)
    WHERE (
      r.id_chofer = $1
      OR r.id_chofer = (SELECT id_chofer FROM Choferes WHERE id_usuario = $1 LIMIT 1)
      OR (
        ch.id_usuario IS NOT NULL
        AND i.id_usuario_reporta = ch.id_usuario
      )
      OR i.id_usuario_reporta = $1
    )
    ORDER BY i.fecha_hora DESC;
  `;

  const result = await pool.query(query, [idChofer]);
  return result.rows;
}

export async function obtenerRutasPorChofer(idChofer: number) {
  const query = `
    SELECT
      r.id_ruta,
      r.nombre,
      r.hora_inicio_estimada,
      r.hora_fin_estimada,
      r.estado,
      s.nombre AS servicio_nombre,
      v.placa AS vehiculo_placa,
      COUNT(DISTINCT ar.id_estudiante) AS total_estudiantes
    FROM Rutas r
    LEFT JOIN Servicios s ON s.id_servicio = r.id_servicio
    LEFT JOIN Vehiculos v ON v.id_vehiculo = r.id_vehiculo
    LEFT JOIN Asignaciones_Ruta ar ON ar.id_ruta = r.id_ruta
    WHERE r.id_chofer = $1 OR r.id_chofer = (SELECT id_chofer FROM Choferes WHERE id_usuario = $1 LIMIT 1)
    GROUP BY r.id_ruta, r.nombre, r.hora_inicio_estimada, r.hora_fin_estimada, r.estado, s.nombre, v.placa
    ORDER BY r.nombre ASC;
  `;

  const result = await pool.query(query, [idChofer]);
  return result.rows;
}
