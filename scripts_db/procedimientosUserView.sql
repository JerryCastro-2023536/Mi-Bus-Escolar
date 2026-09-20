CREATE OR REPLACE FUNCTION sp_estudiantes_por_tutor(
    p_id_usuario_tutor INTEGER
)
RETURNS TABLE (
    id_estudiante INTEGER,
    nombre VARCHAR,
    apellido VARCHAR,
    foto_estudiante TEXT,
    grado VARCHAR,
    nombre_colegio VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id_estudiante,
        e.nombre,
        e.apellido,
        e.foto_estudiante,
        e.grado,
        c.nombre AS nombre_colegio
    FROM estudiantes e
    LEFT JOIN colegios c
        ON c.id_colegio = e.id_colegio
    WHERE e.id_usuario_tutor = p_id_usuario_tutor
    ORDER BY e.nombre, e.apellido;
END;
$$;

CREATE OR REPLACE FUNCTION sp_viajes_activos_por_estudiante(
    p_id_estudiante INTEGER
)
RETURNS TABLE (
    id_viaje INTEGER,
    id_ruta INTEGER,
    id_chofer INTEGER,
    id_vehiculo INTEGER,
    fecha_viaje DATE,
    hora_inicio TIME,
    hora_fin TIME,
    estado VARCHAR,
    nombre_ruta VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN

    RETURN QUERY

    SELECT
        v.id_viaje,
        v.id_ruta,
        v.id_chofer,
        v.id_vehiculo,
        v.fecha_viaje,
        v.hora_inicio,
        v.hora_fin,
        v.estado,
        r.nombre AS nombre_ruta

    FROM viajes v

    INNER JOIN asignaciones_ruta ar
        ON ar.id_ruta = v.id_ruta

    INNER JOIN rutas r
        ON r.id_ruta = v.id_ruta

    WHERE ar.id_estudiante = p_id_estudiante

      AND v.estado = 'ACTIVO'

    ORDER BY
        v.fecha_viaje DESC,
        v.hora_inicio DESC;

END;
$$;