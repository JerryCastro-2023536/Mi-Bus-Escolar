-- ============================================
-- KPIs: usuarios
-- ============================================
CREATE OR REPLACE FUNCTION sp_usuarios_kpis()
RETURNS TABLE (
    total                   INTEGER,
    "porcentajeVerificados" DOUBLE PRECISION
)
LANGUAGE sql STABLE AS $$
    SELECT
        COUNT(*)::int AS total,
        ROUND(
            COALESCE(
                COUNT(*) FILTER (WHERE correo_verificado)::numeric * 100
                / NULLIF(COUNT(*), 0), 0
            ), 1
        )::float8 AS "porcentajeVerificados"
    FROM usuarios;
$$;
 
-- ============================================
-- KPIs: asignaciones_ruta
-- ============================================
CREATE OR REPLACE FUNCTION sp_asignaciones_ruta_kpis()
RETURNS TABLE (total INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT COUNT(*)::int AS total FROM asignaciones_ruta;
$$;
 
-- ============================================
-- KPIs: asistencias
-- ============================================
CREATE OR REPLACE FUNCTION sp_asistencias_kpis()
RETURNS TABLE (total INTEGER, presentes INTEGER, ausentes INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE estado_abordaje = 'PRESENTE')::int AS presentes,
        COUNT(*) FILTER (WHERE estado_abordaje = 'AUSENTE')::int AS ausentes
    FROM asistencias;
$$;
 
-- ============================================
-- KPIs: choferes
-- ============================================
CREATE OR REPLACE FUNCTION sp_choferes_kpis()
RETURNS TABLE (total INTEGER, activos INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE estado = 'ACTIVO')::int AS activos
    FROM choferes;
$$;
 
-- ============================================
-- KPIs: colegios
-- ============================================
CREATE OR REPLACE FUNCTION sp_colegios_kpis()
RETURNS TABLE (total INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT COUNT(*)::int AS total FROM colegios;
$$;
 
-- ============================================
-- KPIs: estudiantes
-- ============================================
CREATE OR REPLACE FUNCTION sp_estudiantes_kpis()
RETURNS TABLE (total INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT COUNT(*)::int AS total FROM estudiantes;
$$;
 
-- ============================================
-- KPIs: incidencias
-- ============================================
CREATE OR REPLACE FUNCTION sp_incidencias_kpis()
RETURNS TABLE (total INTEGER, abiertas INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE estado = 'ABIERTA')::int AS abiertas
    FROM incidencias;
$$;
 
-- ============================================
-- KPIs: notificaciones
-- ============================================
CREATE OR REPLACE FUNCTION sp_notificaciones_kpis()
RETURNS TABLE (total INTEGER, "noLeidas" INTEGER, leidas INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE leida = false)::int AS "noLeidas",
        COUNT(*) FILTER (WHERE leida = true)::int AS leidas
    FROM notificaciones;
$$;
 
-- ============================================
-- KPIs: pagos
-- ============================================
CREATE OR REPLACE FUNCTION sp_pagos_kpis()
RETURNS TABLE (total INTEGER, pendientes INTEGER, verificados INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE estado = 'PENDIENTE')::int AS pendientes,
        COUNT(*) FILTER (WHERE estado = 'PAGADO')::int AS verificados
    FROM pagos;
$$;
 
-- ============================================
-- KPIs: paradas
-- ============================================
CREATE OR REPLACE FUNCTION sp_paradas_kpis()
RETURNS TABLE (total INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT COUNT(*)::int AS total FROM paradas;
$$;
 
-- ============================================
-- KPIs: proveedores
-- ============================================
CREATE OR REPLACE FUNCTION sp_proveedores_kpis()
RETURNS TABLE (total INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT COUNT(*)::int AS total FROM proveedores;
$$;
 
-- ============================================
-- KPIs: ruta_parada
-- ============================================
CREATE OR REPLACE FUNCTION sp_ruta_parada_kpis()
RETURNS TABLE (total INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT COUNT(*)::int AS total FROM ruta_parada;
$$;
 
-- ============================================
-- KPIs: rutas
-- ============================================
CREATE OR REPLACE FUNCTION sp_rutas_kpis()
RETURNS TABLE (total INTEGER, activas INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE estado = 'ACTIVO')::int AS activas
    FROM rutas;
$$;
 
-- ============================================
-- KPIs: servicios
-- ============================================
CREATE OR REPLACE FUNCTION sp_servicios_kpis()
RETURNS TABLE (total INTEGER, activos INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE estado = 'ACTIVO')::int AS activos
    FROM servicios;
$$;
 
-- ============================================
-- KPIs: ubicaciones_bus
-- ============================================
CREATE OR REPLACE FUNCTION sp_ubicaciones_bus_kpis()
RETURNS TABLE (total INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT COUNT(*)::int AS total FROM ubicaciones_bus;
$$;
 
-- ============================================
-- KPIs: valoraciones
-- ============================================
CREATE OR REPLACE FUNCTION sp_valoraciones_kpis()
RETURNS TABLE (total INTEGER, promedio DOUBLE PRECISION)
LANGUAGE sql STABLE AS $$
    SELECT
        COUNT(*)::int AS total,
        ROUND(COALESCE(AVG(calificacion), 0)::numeric, 1)::float8 AS promedio
    FROM valoraciones;
$$;
 
-- ============================================
-- KPIs: vehiculos
-- ============================================
CREATE OR REPLACE FUNCTION sp_vehiculos_kpis()
RETURNS TABLE (total INTEGER, activos INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE estado = 'ACTIVO')::int AS activos
    FROM vehiculos;
$$;
 
-- ============================================
-- KPIs: viajes
-- ============================================
CREATE OR REPLACE FUNCTION sp_viajes_kpis()
RETURNS TABLE (total INTEGER, activos INTEGER)
LANGUAGE sql STABLE AS $$
    SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE estado = 'EN_CURSO')::int AS activos
    FROM viajes;
$$;
 
-- ============================================================
--  ASISTENCIA ESCOLAR 
-- ============================================================
-- ---------- 1) MIS RUTAS + ESTADO DE HOY (chofer) ----------
CREATE OR REPLACE FUNCTION sp_asistencias_mis_rutas(p_id_usuario INTEGER)
RETURNS TABLE (
    id_ruta              INTEGER,
    nombre               TEXT,
    hora_inicio_estimada TIME,
    hora_fin_estimada    TIME,
    total_estudiantes    INTEGER,
    id_viaje_hoy         INTEGER,
    reporte_completo     BOOLEAN,
    presentes            INTEGER,
    ausentes             INTEGER
)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id_ruta,
        r.nombre,
        r.hora_inicio_estimada,
        r.hora_fin_estimada,
        COALESCE(t.total, 0),
        v.id_viaje,
        (v.id_viaje IS NOT NULL
         AND (COALESCE(t.total, 0) = 0 OR COALESCE(t.pendientes, 0) = 0)),
        COALESCE(t.presentes, 0),
        COALESCE(t.ausentes, 0)
    FROM choferes c
    JOIN rutas r
        ON r.id_chofer = c.id_chofer
    -- Viaje de hoy de la ruta (el de mayor id, si hay varios)
    LEFT JOIN LATERAL (
        SELECT id_viaje
        FROM viajes
        WHERE id_ruta = r.id_ruta
          AND fecha_viaje = CURRENT_DATE
        ORDER BY id_viaje DESC
        LIMIT 1
    ) v ON true
    LEFT JOIN LATERAL (
        SELECT
            (SELECT COUNT(*)
             FROM asignaciones_ruta ar
             WHERE ar.id_ruta = r.id_ruta) AS total,
            COUNT(*) FILTER (WHERE a.estado_abordaje = 'PENDIENTE') AS pendientes,
            COUNT(*) FILTER (WHERE a.estado_abordaje = 'PRESENTE')  AS presentes,
            COUNT(*) FILTER (WHERE a.estado_abordaje IN
                ('AUSENTE', 'NO ASISTE', 'NO ASISTIRA'))           AS ausentes
        FROM asistencias a
        WHERE a.id_viaje = v.id_viaje
        GROUP BY a.id_viaje
    ) t ON true
    WHERE c.id_usuario = p_id_usuario
      AND r.estado = 'ACTIVO'
    ORDER BY r.hora_inicio_estimada NULLS LAST, r.nombre;
END;
$$;
 
-- ---------- 2) ESTUDIANTES ASIGNADOS A UNA RUTA ----------
-- Incluye sus paradas de recogida/descenso (útil para mostrar la parada en el checklist)
CREATE OR REPLACE FUNCTION sp_asistencias_estudiantes_ruta(p_id_ruta INTEGER)
RETURNS TABLE (
    id_estudiante      INTEGER,
    nombre             TEXT,
    apellido           TEXT,
    grado              TEXT,
    foto_estudiante    TEXT,
    id_parada_recogida INTEGER,
    id_parada_descenso INTEGER
)
LANGUAGE sql STABLE
AS $$
    SELECT e.id_estudiante, e.nombre, e.apellido, e.grado, e.foto_estudiante,
           ar.id_parada_recogida, ar.id_parada_descenso
    FROM asignaciones_ruta ar
    JOIN estudiantes e ON e.id_estudiante = ar.id_estudiante
    WHERE ar.id_ruta = p_id_ruta
    ORDER BY e.apellido, e.nombre;
$$;
 
-- ---------- 3) VIAJE DE HOY (lo crea y pre-arma los PENDIENTE) ----------
-- Al crearlo, copia chofer y vehículo de la ruta (para trazabilidad del viaje)
CREATE OR REPLACE FUNCTION sp_asistencias_viaje_hoy(p_id_ruta INTEGER)
RETURNS TABLE (
    id_viaje    INTEGER,
    id_ruta     INTEGER,
    id_chofer   INTEGER,
    id_vehiculo INTEGER,
    fecha_viaje DATE,
    hora_inicio TIME,
    hora_fin    TIME,
    estado      TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_viaje INTEGER;
BEGIN
    SELECT id_viaje INTO v_id_viaje
    FROM viajes
    WHERE id_ruta = p_id_ruta
      AND fecha_viaje = CURRENT_DATE
    ORDER BY id_viaje DESC
    LIMIT 1;
 
    IF v_id_viaje IS NULL THEN
        INSERT INTO viajes (id_ruta, id_chofer, id_vehiculo, fecha_viaje, estado)
        SELECT r.id_ruta, r.id_chofer, r.id_vehiculo, CURRENT_DATE, 'PROGRAMADO'
        FROM rutas r
        WHERE r.id_ruta = p_id_ruta
        RETURNING id_viaje INTO v_id_viaje;
 
        -- Pre-arma el checklist: un PENDIENTE por cada estudiante asignado
        -- (usa el constraint uq_asistencia_viaje_estudiante de tu tabla)
        INSERT INTO asistencias (id_viaje, id_estudiante, estado_abordaje, estado_descenso)
        SELECT v_id_viaje, ar.id_estudiante, 'PENDIENTE', 'PENDIENTE'
        FROM asignaciones_ruta ar
        WHERE ar.id_ruta = p_id_ruta
        ON CONFLICT (id_viaje, id_estudiante) DO NOTHING;
    END IF;
 
    RETURN QUERY
        SELECT id_viaje, id_ruta, id_chofer, id_vehiculo,
               fecha_viaje, hora_inicio, hora_fin, estado
        FROM viajes
        WHERE id_viaje = v_id_viaje;
END;
$$;
 
-- ---------- 4) ESTADOS DE HOY POR ESTUDIANTE (precargar checklist) ----------
CREATE OR REPLACE FUNCTION sp_asistencias_estados_viaje(p_id_viaje INTEGER)
RETURNS TABLE (
    id_estudiante   INTEGER,
    estado_abordaje TEXT,
    hora_abordaje   TIMESTAMP
)
LANGUAGE sql STABLE
AS $$
    SELECT a.id_estudiante, a.estado_abordaje, a.hora_abordaje
    FROM asistencias a
    WHERE a.id_viaje = p_id_viaje
    ORDER BY a.id_estudiante;
$$;
 
-- ---------- 5) ENVIAR REPORTE (transacción: asistencias + notificaciones) ----------
-- p_asistencias: JSONB array
--   [ { "id_estudiante": 12, "estado_abordaje": "PRESENTE" }, ... ]
CREATE OR REPLACE FUNCTION sp_asistencias_enviar_reporte(
    p_id_usuario  INTEGER,
    p_id_viaje    INTEGER,
    p_asistencias JSONB
)
RETURNS TABLE (
    presentes       INTEGER,
    ausentes        INTEGER,
    notificaciones  INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_ruta   INTEGER;
    v_presentes INTEGER := 0;
    v_ausentes  INTEGER := 0;
    v_notis     INTEGER := 0;
    v_id_asist  INTEGER;
    v_noti      RECORD;
    v_est       RECORD;
    a           RECORD;
BEGIN
    -- 1) Validaciones
    IF NOT EXISTS (
        SELECT 1
        FROM viajes
        WHERE id_viaje = p_id_viaje
          AND fecha_viaje = CURRENT_DATE
    ) THEN
        RAISE EXCEPTION 'El viaje no existe o no corresponde a hoy';
    END IF;
 
    SELECT id_ruta INTO v_id_ruta
    FROM viajes
    WHERE id_viaje = p_id_viaje;
 
    IF NOT EXISTS (
        SELECT 1
        FROM rutas r
        JOIN choferes c ON c.id_chofer = r.id_chofer
        WHERE r.id_ruta = v_id_ruta
          AND c.id_usuario = p_id_usuario
    ) THEN
        RAISE EXCEPTION 'La ruta no pertenece a este chofer';
    END IF;
 
    -- 2) Actualiza cada estado (solo PRESENTE / AUSENTE)
    FOR a IN
        SELECT (item ->> 'id_estudiante')::INTEGER AS id_estudiante,
               (item ->> 'estado_abordaje')        AS estado_abordaje
        FROM jsonb_array_elements(p_asistencias) AS item
        WHERE (item ->> 'estado_abordaje') IN ('PRESENTE', 'AUSENTE')
    LOOP
        UPDATE asistencias
        SET estado_abordaje = a.estado_abordaje,
            hora_abordaje   = NOW()
        WHERE id_viaje = p_id_viaje
          AND id_estudiante = a.id_estudiante;
 
        IF NOT FOUND THEN
            RAISE EXCEPTION 'El estudiante % no está asignado a este viaje',
                a.id_estudiante;
        END IF;
 
        SELECT id_asistencia INTO v_id_asist
        FROM asistencias
        WHERE id_viaje = p_id_viaje
          AND id_estudiante = a.id_estudiante;
 
        IF a.estado_abordaje = 'PRESENTE' THEN
            v_presentes := v_presentes + 1;
        ELSE
            v_ausentes := v_ausentes + 1;
 
            -- Idempotencia: si reenvía, no duplica notificaciones
            DELETE FROM notificaciones
            WHERE id_asistencia = v_id_asist
              AND tipo = 'INASISTENCIA';
 
            -- Notificación al tutor (vía tu sp_notificaciones_agregar)
            SELECT nombre, apellido, id_usuario_tutor
            INTO v_est
            FROM estudiantes
            WHERE id_estudiante = a.id_estudiante;
 
            IF v_est.id_usuario_tutor IS NOT NULL THEN
                SELECT * INTO v_noti
                FROM sp_notificaciones_agregar(
                    v_est.id_usuario_tutor,       -- $1 id_usuario
                    NULL,                         -- $2 id_incidencia
                    v_id_asist,                   -- $3 id_asistencia
                    'INASISTENCIA',               -- $4 tipo
                    'Inasistencia de estudiante', -- $5 titulo
                    'Su hijo ' || v_est.nombre || ' ' || v_est.apellido ||
                    ' no asistió hoy al servicio de transporte.', -- $6 mensaje
                    false,                        -- $7 leida
                    NOW()                         -- $8 fecha_envio
                );
 
                IF FOUND THEN
                    v_notis := v_notis + 1;
                END IF;
            END IF;
        END IF;
    END LOOP;
 
    -- 3) Resumen
    RETURN QUERY SELECT v_presentes, v_ausentes, v_notis;
END;
$$;
 
-- ---------- 6) NOTIFICACIONES DEL USUARIO LOGUEADO ----------
-- (variante por usuario de tu sp_notificaciones_listar, que lista todas)
CREATE OR REPLACE FUNCTION sp_notificaciones_listar_usuario(p_id_usuario INTEGER)
RETURNS TABLE (
    id_notificacion INTEGER,
    tipo            TEXT,
    titulo          TEXT,
    mensaje         TEXT,
    leida           BOOLEAN,
    fecha_envio     TIMESTAMP
)
LANGUAGE sql STABLE
AS $$
    SELECT id_notificacion, tipo, titulo, mensaje, leida, fecha_envio
    FROM notificaciones
    WHERE id_usuario = p_id_usuario
    ORDER BY fecha_envio DESC;
$$;
 
CREATE OR REPLACE FUNCTION sp_notificaciones_no_leidas(p_id_usuario INTEGER)
RETURNS TABLE (cant INTEGER)
LANGUAGE sql STABLE
AS $$
    SELECT COUNT(*)::INTEGER
    FROM notificaciones
    WHERE id_usuario = p_id_usuario
    AND leida = false;
$$;
 
-- Solo su dueño puede marcarla como leída
CREATE OR REPLACE FUNCTION sp_notificaciones_marcar_leida(
    p_id_notificacion INTEGER,
    p_id_usuario      INTEGER
)
RETURNS TABLE (ok BOOLEAN)
LANGUAGE plpgsql
AS $$
DECLARE
    v_filas INTEGER;
BEGIN
    UPDATE notificaciones
    SET leida = true
    WHERE id_notificacion = p_id_notificacion
      AND id_usuario = p_id_usuario;
    GET DIAGNOSTICS v_filas = ROW_COUNT;
    RETURN QUERY SELECT (v_filas > 0);
END;
$$;

-- Actualizar Password
CREATE OR REPLACE FUNCTION sp_usuarios_editarPassword(
    p_password VARCHAR,
    p_id_usuario INT
)
RETURNS SETOF usuarios AS $$
BEGIN
    RETURN QUERY
    UPDATE usuarios 
    SET password = p_password WHERE id_usuario = p_id_usuario
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SP 1: Estudiantes asignados a un tutor (usuario)
-- ============================================================
CREATE OR REPLACE FUNCTION sp_estudiantes_por_tutor(p_id_usuario_tutor INTEGER)
RETURNS TABLE (
    id_estudiante INTEGER,
    nombre VARCHAR,
    apellido VARCHAR,
    fecha_nacimiento DATE,
    foto_estudiante TEXT,
    grado VARCHAR,
    id_colegio INTEGER,
    nombre_colegio VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id_estudiante,
        e.nombre,
        e.apellido,
        e.fecha_nacimiento,
        e.foto_estudiante,
        e.grado,
        c.id_colegio,
        c.nombre
    FROM Estudiantes e
    LEFT JOIN Colegios c ON e.id_colegio = c.id_colegio
    WHERE e.id_usuario_tutor = p_id_usuario_tutor
    ORDER BY e.nombre;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- SP 2: 10 meses (actual + 9 siguientes) con estado de pago
-- ============================================================
CREATE OR REPLACE FUNCTION sp_pagos_meses_pendientes(p_id_estudiante INTEGER)
RETURNS TABLE (
    id_servicio INTEGER,
    nombre_servicio VARCHAR,
    precio_mensual DECIMAL,
    periodo_mes INTEGER,
    periodo_anio INTEGER,
    id_pago INTEGER,
    estado VARCHAR,
    monto DECIMAL,
    metodo_pago VARCHAR,
    referencia_pago VARCHAR,
    foto_comprobante TEXT,
    fecha_pago_limite DATE,
    fecha_verificacion DATE
) AS $$
DECLARE
    v_id_servicio INTEGER;
BEGIN
    -- Servicio vigente del estudiante (vía su asignación de ruta más reciente)
    SELECT s.id_servicio INTO v_id_servicio
    FROM Asignaciones_Ruta ar
    JOIN Rutas r ON ar.id_ruta = r.id_ruta
    JOIN Servicios s ON r.id_servicio = s.id_servicio
    WHERE ar.id_estudiante = p_id_estudiante
    ORDER BY ar.id_asignacion DESC
    LIMIT 1;

    IF v_id_servicio IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        s.id_servicio,
        s.nombre,
        s.precio_mensual,
        meses.mes::INTEGER,
        meses.anio::INTEGER,
        p.id_pago,
        COALESCE(p.estado, 'PENDIENTE')::VARCHAR,
        p.monto,
        p.metodo_pago,
        p.referencia_pago,
        p.foto_comprobante,
        p.fecha_pago_limite,
        p.fecha_verificacion
    FROM Servicios s
    CROSS JOIN LATERAL (
        SELECT
            EXTRACT(MONTH FROM d)::INTEGER AS mes,
            EXTRACT(YEAR FROM d)::INTEGER AS anio
        FROM generate_series(
            date_trunc('month', CURRENT_DATE),
            date_trunc('month', CURRENT_DATE) + INTERVAL '9 months',
            INTERVAL '1 month'
        ) AS d
    ) meses
    LEFT JOIN Pagos p
        ON p.id_estudiante = p_id_estudiante
        AND p.id_servicio = s.id_servicio
        AND p.periodo_mes = meses.mes
        AND p.periodo_anio = meses.anio
    WHERE s.id_servicio = v_id_servicio
    ORDER BY meses.anio, meses.mes;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- SP 3: Detalle de un pago específico (pagado o no)
-- ============================================================
CREATE OR REPLACE FUNCTION sp_pagos_detalle(
    p_id_estudiante INTEGER,
    p_id_servicio INTEGER,
    p_periodo_mes INTEGER,
    p_periodo_anio INTEGER
)
RETURNS TABLE (
    id_pago INTEGER,
    id_estudiante INTEGER,
    id_servicio INTEGER,
    nombre_servicio VARCHAR,
    precio_mensual DECIMAL,
    periodo_mes INTEGER,
    periodo_anio INTEGER,
    monto DECIMAL,
    metodo_pago VARCHAR,
    referencia_pago VARCHAR,
    foto_comprobante TEXT,
    estado VARCHAR,
    fecha_pago_limite DATE,
    fecha_verificacion DATE,
    verificado_por INTEGER,
    observaciones VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id_pago, p.id_estudiante, p.id_servicio, s.nombre, s.precio_mensual,
        p.periodo_mes, p.periodo_anio, p.monto, p.metodo_pago, p.referencia_pago,
        p.foto_comprobante, p.estado, p.fecha_pago_limite, p.fecha_verificacion,
        p.verificado_por, p.observaciones
    FROM Pagos p
    JOIN Servicios s ON p.id_servicio = s.id_servicio
    WHERE p.id_estudiante = p_id_estudiante
      AND p.id_servicio = p_id_servicio
      AND p.periodo_mes = p_periodo_mes
      AND p.periodo_anio = p_periodo_anio;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- SP 4: Registrar un pago (se marca PAGADO al momento de crearse)
-- ============================================================
CREATE OR REPLACE FUNCTION sp_pagos_registrar(
    p_id_estudiante INTEGER,
    p_id_servicio INTEGER,
    p_periodo_mes INTEGER,
    p_periodo_anio INTEGER,
    p_monto DECIMAL,
    p_metodo_pago VARCHAR,
    p_referencia_pago VARCHAR,
    p_foto_comprobante TEXT
)
RETURNS TABLE (
    id_pago INTEGER,
    id_estudiante INTEGER,
    id_servicio INTEGER,
    periodo_mes INTEGER,
    periodo_anio INTEGER,
    monto DECIMAL,
    metodo_pago VARCHAR,
    referencia_pago VARCHAR,
    foto_comprobante TEXT,
    estado VARCHAR,
    fecha_verificacion DATE
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO Pagos (
        id_estudiante, id_servicio, periodo_mes, periodo_anio,
        monto, metodo_pago, referencia_pago, foto_comprobante,
        estado, fecha_verificacion
    )
    VALUES (
        p_id_estudiante, p_id_servicio, p_periodo_mes, p_periodo_anio,
        p_monto, p_metodo_pago, p_referencia_pago, p_foto_comprobante,
        'PAGADO', CURRENT_DATE
    )
    RETURNING
        Pagos.id_pago, Pagos.id_estudiante, Pagos.id_servicio,
        Pagos.periodo_mes, Pagos.periodo_anio, Pagos.monto,
        Pagos.metodo_pago, Pagos.referencia_pago, Pagos.foto_comprobante,
        Pagos.estado, Pagos.fecha_verificacion;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- SP 5: Usuario (proveedor) responsable de un servicio, para notificar
-- ============================================================
CREATE OR REPLACE FUNCTION sp_proveedor_usuario_por_servicio(p_id_servicio INTEGER)
RETURNS TABLE (id_usuario INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT pr.id_usuario
    FROM Servicios s
    JOIN Proveedores pr ON s.id_proveedor = pr.id_proveedor
    WHERE s.id_servicio = p_id_servicio;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- SP 6: Agregar notificación (genérico, reutilizable)
-- ============================================================
CREATE OR REPLACE FUNCTION sp_notificaciones_agregarPago(
    p_id_usuario INTEGER,
    p_id_incidencia INTEGER,
    p_id_asistencia INTEGER,
    p_tipo VARCHAR,
    p_titulo VARCHAR,
    p_mensaje TEXT
)
RETURNS TABLE (id_notificacion INTEGER) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO Notificaciones (id_usuario, id_incidencia, id_asistencia, tipo, titulo, mensaje)
    VALUES (p_id_usuario, p_id_incidencia, p_id_asistencia, p_tipo, p_titulo, p_mensaje)
    RETURNING Notificaciones.id_notificacion;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PAGOS · VISTA DEL PROVEEDOR
-- ============================================================

-- ------------------------------------------------------------
-- 1. ¿El servicio pertenece al proveedor (identificado por id_usuario)?
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_proveedor_es_dueno_servicio(
    p_id_usuario  INTEGER,
    p_id_servicio INTEGER
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM Servicios s
        JOIN Proveedores p ON p.id_proveedor = s.id_proveedor
        WHERE s.id_servicio = p_id_servicio
          AND p.id_usuario  = p_id_usuario
    );
$$;


-- ------------------------------------------------------------
-- 2. Servicios del proveedor + total de estudiantes asignados
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_proveedor_servicios_listar(
    p_id_usuario INTEGER
)
RETURNS TABLE (
    id_servicio       INTEGER,
    nombre            VARCHAR(150),
    descripcion       TEXT,
    precio_mensual    DECIMAL(10,2),
    estado            VARCHAR(10),
    total_estudiantes INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id_servicio,
        s.nombre,
        s.descripcion,
        s.precio_mensual,
        s.estado,
        (
            SELECT COUNT(DISTINCT a.id_estudiante)::INTEGER
            FROM Rutas r
            JOIN Asignaciones_Ruta a ON a.id_ruta = r.id_ruta
            WHERE r.id_servicio = s.id_servicio
        ) AS total_estudiantes
    FROM Servicios s
    JOIN Proveedores p ON p.id_proveedor = s.id_proveedor
    WHERE p.id_usuario = p_id_usuario
    ORDER BY s.nombre;
END;
$$;


-- ------------------------------------------------------------
-- 3. Estudiantes asignados a alguna ruta del servicio
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_proveedor_estudiantes_por_servicio(
    p_id_servicio INTEGER
)
RETURNS TABLE (
    id_estudiante   INTEGER,
    nombre          VARCHAR(100),
    apellido        VARCHAR(100),
    grado           VARCHAR(50),
    nombre_colegio  VARCHAR(200),
    foto_estudiante TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        e.id_estudiante,
        e.nombre,
        e.apellido,
        e.grado,
        c.nombre,
        e.foto_estudiante
    FROM Rutas r
    JOIN Asignaciones_Ruta a ON a.id_ruta = r.id_ruta
    JOIN Estudiantes e       ON e.id_estudiante = a.id_estudiante
    LEFT JOIN Colegios c     ON c.id_colegio = e.id_colegio
    WHERE r.id_servicio = p_id_servicio
    ORDER BY e.apellido, e.nombre;
END;
$$;


-- ------------------------------------------------------------
-- 4. Meses de pago de un estudiante para UN servicio.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_proveedor_meses_estudiante(
    p_id_estudiante INTEGER,
    p_id_servicio   INTEGER
)
RETURNS TABLE (
    id_servicio       INTEGER,
    nombre_servicio   VARCHAR,
    precio_mensual    DECIMAL(10,2),
    periodo_mes       INTEGER,
    periodo_anio      INTEGER,
    id_pago           INTEGER,
    estado            VARCHAR,
    monto             DECIMAL(10,2),
    metodo_pago       VARCHAR,
    referencia_pago   VARCHAR,
    foto_comprobante  TEXT,
    fecha_pago_limite DATE,
    fecha_verificacion DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- El estudiante debe estar asignado a una ruta de ese servicio
    IF NOT EXISTS (
        SELECT 1
        FROM Asignaciones_Ruta a
        JOIN Rutas r ON r.id_ruta = a.id_ruta
        WHERE a.id_estudiante = p_id_estudiante
          AND r.id_servicio   = p_id_servicio
    ) THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        m.id_servicio::INTEGER,
        m.nombre_servicio::VARCHAR,
        m.precio_mensual::DECIMAL(10,2),
        m.periodo_mes::INTEGER,
        m.periodo_anio::INTEGER,
        m.id_pago::INTEGER,
        m.estado::VARCHAR,
        m.monto::DECIMAL(10,2),
        m.metodo_pago::VARCHAR,
        m.referencia_pago::VARCHAR,
        m.foto_comprobante::TEXT,
        m.fecha_pago_limite::DATE,
        m.fecha_verificacion::DATE
    FROM sp_pagos_meses_pendientes(p_id_estudiante) m
    WHERE m.id_servicio = p_id_servicio
    ORDER BY m.periodo_anio, m.periodo_mes;
END;
$$;

-- ============================================================
-- SERVICIOS · VISTA DEL PROVEEDOR
-- ============================================================

-- ------------------------------------------------------------
-- 1. id_proveedor a partir del usuario logueado (NULL si el usuario
--    no es proveedor). Proveedores.id_usuario es UNIQUE.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_proveedor_id_por_usuario(
    p_id_usuario INTEGER
)
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$
    SELECT p.id_proveedor
    FROM Proveedores p
    WHERE p.id_usuario = p_id_usuario;
$$;


-- ------------------------------------------------------------
-- 2. ¿El proveedor ya tiene un servicio con ese nombre?
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_servicios_nombre_existe(
    p_id_proveedor INTEGER,
    p_nombre       VARCHAR
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM Servicios s
        WHERE s.id_proveedor = p_id_proveedor
          AND LOWER(TRIM(s.nombre)) = LOWER(TRIM(p_nombre))
    );
$$;


-- ------------------------------------------------------------
-- 3. Servicios del proveedor con conteo de rutas y estudiantes
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_servicios_por_proveedor(
    p_id_proveedor INTEGER
)
RETURNS TABLE (
    id_servicio       INTEGER,
    nombre            VARCHAR(150),
    descripcion       TEXT,
    precio_mensual    DECIMAL(10,2),
    estado            VARCHAR(10),
    fecha_creacion    TIMESTAMP,
    total_rutas       INTEGER,
    total_estudiantes INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id_servicio,
        s.nombre,
        s.descripcion,
        s.precio_mensual,
        s.estado,
        s.fecha_creacion,
        (
            SELECT COUNT(*)::INTEGER
            FROM Rutas r
            WHERE r.id_servicio = s.id_servicio
        ) AS total_rutas,
        (
            SELECT COUNT(DISTINCT a.id_estudiante)::INTEGER
            FROM Rutas r
            JOIN Asignaciones_Ruta a ON a.id_ruta = r.id_ruta
            WHERE r.id_servicio = s.id_servicio
        ) AS total_estudiantes
    FROM Servicios s
    WHERE s.id_proveedor = p_id_proveedor
    ORDER BY s.nombre;
END;
$$;


-- ------------------------------------------------------------
-- 4. Registrar un servicio nuevo (queda ACTIVO por defecto).
--    Devuelve la fila con la misma forma que sp_servicios_por_proveedor.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_servicios_registrar(
    p_id_proveedor   INTEGER,
    p_nombre         VARCHAR,
    p_descripcion    TEXT,
    p_precio_mensual DECIMAL
)
RETURNS TABLE (
    id_servicio       INTEGER,
    nombre            VARCHAR(150),
    descripcion       TEXT,
    precio_mensual    DECIMAL(10,2),
    estado            VARCHAR(10),
    fecha_creacion    TIMESTAMP,
    total_rutas       INTEGER,
    total_estudiantes INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_servicio INTEGER;
BEGIN
    INSERT INTO Servicios (id_proveedor, nombre, descripcion, precio_mensual)
    VALUES (p_id_proveedor, p_nombre, p_descripcion, p_precio_mensual)
    RETURNING Servicios.id_servicio INTO v_id_servicio;

    RETURN QUERY
    SELECT
        s.id_servicio,
        s.nombre,
        s.descripcion,
        s.precio_mensual,
        s.estado,
        s.fecha_creacion,
        0::INTEGER,   -- un servicio recién creado aún no tiene rutas
        0::INTEGER    -- ni estudiantes
    FROM Servicios s
    WHERE s.id_servicio = v_id_servicio;
END;
$$;


-- ============================================================
-- ADMINISTRAR SERVICIO (editar · activar/desactivar · eliminar)
-- Todas filtran por id_proveedor: un proveedor solo puede tocar sus servicios.
-- ============================================================


-- ------------------------------------------------------------
-- 5. ¿Otro servicio del mismo proveedor ya usa ese nombre?
--    (excluye al propio servicio que se está editando)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_servicios_nombre_existe_otro(
    p_id_proveedor INTEGER,
    p_nombre       VARCHAR,
    p_id_servicio  INTEGER
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM Servicios s
        WHERE s.id_proveedor = p_id_proveedor
          AND s.id_servicio <> p_id_servicio
          AND LOWER(TRIM(s.nombre)) = LOWER(TRIM(p_nombre))
    );
$$;


-- ------------------------------------------------------------
-- 6. Actualizar un servicio (datos + estado).
--    Devuelve la fila actualizada con la misma forma que
--    sp_servicios_por_proveedor. Sin filas = no existe o no es del proveedor.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_servicios_actualizar(
    p_id_servicio    INTEGER,
    p_id_proveedor   INTEGER,
    p_nombre         VARCHAR,
    p_descripcion    TEXT,
    p_precio_mensual DECIMAL,
    p_estado         VARCHAR
)
RETURNS TABLE (
    id_servicio       INTEGER,
    nombre            VARCHAR(150),
    descripcion       TEXT,
    precio_mensual    DECIMAL(10,2),
    estado            VARCHAR(10),
    fecha_creacion    TIMESTAMP,
    total_rutas       INTEGER,
    total_estudiantes INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Servicios
    SET nombre         = p_nombre,
        descripcion    = p_descripcion,
        precio_mensual = p_precio_mensual,
        estado         = p_estado
    WHERE Servicios.id_servicio  = p_id_servicio
      AND Servicios.id_proveedor = p_id_proveedor;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT f.*
    FROM sp_servicios_por_proveedor(p_id_proveedor) f
    WHERE f.id_servicio = p_id_servicio;
END;
$$;


-- ------------------------------------------------------------
-- 7. Dependencias de un servicio
--    Sin filas = no existe o no es del proveedor.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_servicios_dependencias(
    p_id_proveedor INTEGER,
    p_id_servicio  INTEGER
)
RETURNS TABLE (
    total_rutas INTEGER,
    total_pagos INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*)::INTEGER FROM Rutas r  WHERE r.id_servicio  = s.id_servicio),
        (SELECT COUNT(*)::INTEGER FROM Pagos pg WHERE pg.id_servicio = s.id_servicio)
    FROM Servicios s
    WHERE s.id_servicio  = p_id_servicio
      AND s.id_proveedor = p_id_proveedor;
END;
$$;


-- ------------------------------------------------------------
-- 8. Eliminar un servicio SOLO si no tiene rutas ni pagos.
--    Las FK de Rutas y Pagos son ON DELETE CASCADE: sin esta guarda,
--    borrar el servicio arrastraría rutas, asignaciones y el historial
--    de pagos. Devuelve las filas eliminadas (0 = no se eliminó nada).
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_servicios_eliminar(
    p_id_servicio  INTEGER,
    p_id_proveedor INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_filas INTEGER;
BEGIN
    DELETE FROM Servicios s
    WHERE s.id_servicio  = p_id_servicio
      AND s.id_proveedor = p_id_proveedor
      AND NOT EXISTS (SELECT 1 FROM Rutas r  WHERE r.id_servicio  = s.id_servicio)
      AND NOT EXISTS (SELECT 1 FROM Pagos pg WHERE pg.id_servicio = s.id_servicio);

    GET DIAGNOSTICS v_filas = ROW_COUNT;
    RETURN v_filas;
END;
$$;