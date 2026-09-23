-- ============================================================
-- LANDING · VALORACIONES POR SERVICIO
-- ============================================================

CREATE OR REPLACE FUNCTION sp_valoraciones_obtener_detalle()
RETURNS TABLE (
    id_valoracion INTEGER,
    id_servicio INTEGER,
    nombre_servicio VARCHAR(150),
    id_usuario INTEGER,
    comentario TEXT,
    calificacion DOUBLE PRECISION,
    nombre_usuario VARCHAR(100),
    apellido_usuario VARCHAR(100),
    foto_usuario TEXT
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        v.id_valoracion,
        v.id_servicio,
        s.nombre AS nombre_servicio,
        v.id_usuario,
        v.comentario,
        v.calificacion,
        u.nombre AS nombre_usuario,
        u.apellido AS apellido_usuario,
        u.foto_usuario
    FROM Valoraciones v
    JOIN Servicios s
        ON s.id_servicio = v.id_servicio
    LEFT JOIN Usuarios u
        ON u.id_usuario = v.id_usuario
    ORDER BY v.id_valoracion DESC;
$$;

-- Una cuenta con rol USUARIO mantiene una sola reseña por servicio.
-- Si vuelve a valorar, se actualiza su comentario/calificación.
CREATE OR REPLACE FUNCTION sp_valoracion_usuario_guardar(
    p_id_servicio INTEGER,
    p_id_usuario INTEGER,
    p_comentario TEXT,
    p_calificacion DOUBLE PRECISION
)
RETURNS TABLE (
    id_valoracion INTEGER,
    id_servicio INTEGER,
    id_usuario INTEGER,
    comentario TEXT,
    calificacion DOUBLE PRECISION
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_calificacion < 0 OR p_calificacion > 5 THEN
        RAISE EXCEPTION 'La calificación debe estar entre 0 y 5';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM Usuarios u
        WHERE u.id_usuario = p_id_usuario
          AND UPPER(u.rol) = 'USUARIO'
    ) THEN
        RAISE EXCEPTION 'Solo los usuarios pueden valorar servicios';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM Servicios s
        WHERE s.id_servicio = p_id_servicio
          AND UPPER(s.estado) = 'ACTIVO'
    ) THEN
        RAISE EXCEPTION 'El servicio no existe o no está activo';
    END IF;

    RETURN QUERY
    INSERT INTO Valoraciones AS v (
        id_servicio,
        id_usuario,
        comentario,
        calificacion
    )
    VALUES (
        p_id_servicio,
        p_id_usuario,
        NULLIF(TRIM(p_comentario), ''),
        p_calificacion
    )
    ON CONFLICT ON CONSTRAINT uq_valoracion_servicio_usuario
    DO UPDATE SET
        comentario = EXCLUDED.comentario,
        calificacion = EXCLUDED.calificacion
    RETURNING
        v.id_valoracion,
        v.id_servicio,
        v.id_usuario,
        v.comentario,
        v.calificacion;
END;
$$;
