CREATE OR REPLACE FUNCTION sp_valoraciones_obtener_detalle()
RETURNS TABLE (
    id_valoracion INTEGER,
    id_proveedor INTEGER,
    id_usuario INTEGER,
    comentario TEXT,
    calificacion DOUBLE PRECISION,
    nombre_usuario VARCHAR(100),
    apellido_usuario VARCHAR(100)
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        v.id_valoracion,
        v.id_proveedor,
        v.id_usuario,
        v.comentario,
        v.calificacion,
        u.nombre AS nombre_usuario,
        u.apellido AS apellido_usuario
    FROM Valoraciones v
    LEFT JOIN Usuarios u
        ON u.id_usuario = v.id_usuario
    ORDER BY v.id_valoracion DESC;
$$;