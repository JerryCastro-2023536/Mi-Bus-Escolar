import { pool } from "../config/conexion";

export async function obtenerVehiculosPorChofer(idChofer: number) {
  const query = `
    SELECT
      v.id_vehiculo,
      v.placa,
      v.estado,
      p.nombre_negocio AS proveedor
    FROM Rutas r
    INNER JOIN Vehiculos v ON v.id_vehiculo = r.id_vehiculo
    LEFT JOIN Proveedores p ON p.id_proveedor = v.id_proveedor
    WHERE r.id_chofer = $1
    GROUP BY v.id_vehiculo, v.placa, v.estado, p.nombre_negocio
    ORDER BY v.placa ASC;
  `;

  const result = await pool.query(query, [idChofer]);
  return result.rows;
}

export async function obtenerEstudiantesPorChofer(idChofer: number) {
  const query = `
    SELECT
      e.id_estudiante,
      e.nombre,
      e.apellido,
      e.grado,
      c.nombre AS colegio
    FROM Asignaciones_Ruta ar
    INNER JOIN Rutas r ON r.id_ruta = ar.id_ruta
    INNER JOIN Estudiantes e ON e.id_estudiante = ar.id_estudiante
    LEFT JOIN Colegios c ON c.id_colegio = e.id_colegio
    WHERE r.id_chofer = $1
    GROUP BY e.id_estudiante, e.nombre, e.apellido, e.grado, c.nombre
    ORDER BY e.apellido, e.nombre ASC;
  `;

  const result = await pool.query(query, [idChofer]);
  return result.rows;
}

export async function obtenerReportesPorChofer(idChofer: number) {
  const query = `
    SELECT
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
    WHERE i.id_usuario_reporta = (
      SELECT id_usuario
      FROM Choferes
      WHERE id_chofer = $1
      LIMIT 1
    )
    ORDER BY i.fecha_hora DESC;
  `;

  const result = await pool.query(query, [idChofer]);
  return result.rows;
}
