/* ===============================================
	PROCEDIMIENTOS ALAMCENADOS
   ================================================*/
-- ============================================================
-- 1. VALORACIONES
-- ============================================================

CREATE OR REPLACE FUNCTION sp_valoraciones_obtener()
RETURNS SETOF Valoraciones
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Valoraciones;
END;
$$;


CREATE OR REPLACE FUNCTION sp_valoraciones_crear(
    p_id_proveedor INTEGER,
    p_comentario TEXT,
    p_calificacion DOUBLE PRECISION
)
RETURNS Valoraciones
LANGUAGE plpgsql
AS $$
DECLARE
    v_valoracion Valoraciones;
BEGIN
    INSERT INTO Valoraciones(
        id_proveedor,
        comentario,
        calificacion
    )
    VALUES (
        p_id_proveedor,
        p_comentario,
        p_calificacion
    )
    RETURNING * INTO v_valoracion;

    RETURN v_valoracion;
END;
$$;


CREATE OR REPLACE FUNCTION sp_valoraciones_buscar(
    p_id_valoracion INTEGER
)
RETURNS SETOF Valoraciones
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Valoraciones
    WHERE id_valoracion = p_id_valoracion;
END;
$$;


CREATE OR REPLACE FUNCTION sp_valoraciones_editar(
    p_id_valoracion INTEGER,
    p_id_proveedor INTEGER,
    p_comentario TEXT,
    p_calificacion DOUBLE PRECISION
)
RETURNS Valoraciones
LANGUAGE plpgsql
AS $$
DECLARE
    v_valoracion Valoraciones;
BEGIN
    UPDATE Valoraciones
    SET id_proveedor = p_id_proveedor,
        comentario = p_comentario,
        calificacion = p_calificacion
    WHERE id_valoracion = p_id_valoracion
    RETURNING * INTO v_valoracion;

    RETURN v_valoracion;
END;
$$;


CREATE OR REPLACE FUNCTION sp_valoraciones_eliminar(
    p_id_valoracion INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Valoraciones
    WHERE id_valoracion = p_id_valoracion;

    RETURN FOUND;
END;
$$;



-- ============================================================
-- 2. CHOFERES
-- ============================================================

CREATE OR REPLACE FUNCTION sp_choferes_obtener()
RETURNS SETOF Choferes
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Choferes;
END;
$$;


CREATE OR REPLACE FUNCTION sp_choferes_crear(
    p_id_usuario INTEGER,
    p_telefono_contacto VARCHAR(20),
    p_estado VARCHAR(10)
)
RETURNS Choferes
LANGUAGE plpgsql
AS $$
DECLARE
    v_chofer Choferes;
BEGIN
    INSERT INTO Choferes(
        id_usuario,
        telefono_contacto,
        estado
    )
    VALUES (
        p_id_usuario,
        p_telefono_contacto,
        p_estado
    )
    RETURNING * INTO v_chofer;

    RETURN v_chofer;
END;
$$;


CREATE OR REPLACE FUNCTION sp_choferes_buscar(
    p_id_chofer INTEGER
)
RETURNS SETOF Choferes
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Choferes
    WHERE id_chofer = p_id_chofer;
END;
$$;


CREATE OR REPLACE FUNCTION sp_choferes_editar(
    p_id_chofer INTEGER,
    p_id_usuario INTEGER,
    p_telefono_contacto VARCHAR(20),
    p_estado VARCHAR(10)
)
RETURNS Choferes
LANGUAGE plpgsql
AS $$
DECLARE
    v_chofer Choferes;
BEGIN
    UPDATE Choferes
    SET id_usuario = p_id_usuario,
        telefono_contacto = p_telefono_contacto,
        estado = p_estado
    WHERE id_chofer = p_id_chofer
    RETURNING * INTO v_chofer;

    RETURN v_chofer;
END;
$$;


CREATE OR REPLACE FUNCTION sp_choferes_eliminar(
    p_id_chofer INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Choferes
    WHERE id_chofer = p_id_chofer;

    RETURN FOUND;
END;
$$;



-- ============================================================
-- 3. COLEGIOS
-- ============================================================

CREATE OR REPLACE FUNCTION sp_colegios_obtener()
RETURNS SETOF Colegios
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Colegios;
END;
$$;


CREATE OR REPLACE FUNCTION sp_colegios_crear(
    p_nombre VARCHAR(200),
    p_direccion VARCHAR(255),
    p_telefono_contacto VARCHAR(20)
)
RETURNS Colegios
LANGUAGE plpgsql
AS $$
DECLARE
    v_colegio Colegios;
BEGIN
    INSERT INTO Colegios(
        nombre,
        direccion,
        telefono_contacto
    )
    VALUES (
        p_nombre,
        p_direccion,
        p_telefono_contacto
    )
    RETURNING * INTO v_colegio;

    RETURN v_colegio;
END;
$$;


CREATE OR REPLACE FUNCTION sp_colegios_buscar(
    p_id_colegio INTEGER
)
RETURNS SETOF Colegios
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Colegios
    WHERE id_colegio = p_id_colegio;
END;
$$;


CREATE OR REPLACE FUNCTION sp_colegios_editar(
    p_id_colegio INTEGER,
    p_nombre VARCHAR(200),
    p_direccion VARCHAR(255),
    p_telefono_contacto VARCHAR(20)
)
RETURNS Colegios
LANGUAGE plpgsql
AS $$
DECLARE
    v_colegio Colegios;
BEGIN
    UPDATE Colegios
    SET nombre = p_nombre,
        direccion = p_direccion,
        telefono_contacto = p_telefono_contacto
    WHERE id_colegio = p_id_colegio
    RETURNING * INTO v_colegio;

    RETURN v_colegio;
END;
$$;


CREATE OR REPLACE FUNCTION sp_colegios_eliminar(
    p_id_colegio INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Colegios
    WHERE id_colegio = p_id_colegio;

    RETURN FOUND;
END;
$$;



-- ============================================================
-- 4. ESTUDIANTES
-- ============================================================

CREATE OR REPLACE FUNCTION sp_estudiantes_obtener()
RETURNS SETOF Estudiantes
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Estudiantes;
END;
$$;


CREATE OR REPLACE FUNCTION sp_estudiantes_crear(
    p_id_usuario_tutor INTEGER,
    p_id_colegio INTEGER,
    p_nombre VARCHAR(100),
    p_apellido VARCHAR(100),
    p_fecha_nacimiento DATE,
    p_foto_estudiante TEXT,
    p_grado VARCHAR(50)
)
RETURNS Estudiantes
LANGUAGE plpgsql
AS $$
DECLARE
    v_estudiante Estudiantes;
BEGIN
    INSERT INTO Estudiantes(
        id_usuario_tutor,
        id_colegio,
        nombre,
        apellido,
        fecha_nacimiento,
        foto_estudiante,
        grado
    )
    VALUES (
        p_id_usuario_tutor,
        p_id_colegio,
        p_nombre,
        p_apellido,
        p_fecha_nacimiento,
        p_foto_estudiante,
        p_grado
    )
    RETURNING * INTO v_estudiante;

    RETURN v_estudiante;
END;
$$;


CREATE OR REPLACE FUNCTION sp_estudiantes_buscar(
    p_id_estudiante INTEGER
)
RETURNS SETOF Estudiantes
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Estudiantes
    WHERE id_estudiante = p_id_estudiante;
END;
$$;


CREATE OR REPLACE FUNCTION sp_estudiantes_editar(
    p_id_estudiante INTEGER,
    p_id_usuario_tutor INTEGER,
    p_id_colegio INTEGER,
    p_nombre VARCHAR(100),
    p_apellido VARCHAR(100),
    p_fecha_nacimiento DATE,
    p_foto_estudiante TEXT,
    p_grado VARCHAR(50)
)
RETURNS Estudiantes
LANGUAGE plpgsql
AS $$
DECLARE
    v_estudiante Estudiantes;
BEGIN
    UPDATE Estudiantes
    SET id_usuario_tutor = p_id_usuario_tutor,
        id_colegio = p_id_colegio,
        nombre = p_nombre,
        apellido = p_apellido,
        fecha_nacimiento = p_fecha_nacimiento,
        foto_estudiante = p_foto_estudiante,
        grado = p_grado
    WHERE id_estudiante = p_id_estudiante
    RETURNING * INTO v_estudiante;

    RETURN v_estudiante;
END;
$$;


CREATE OR REPLACE FUNCTION sp_estudiantes_eliminar(
    p_id_estudiante INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Estudiantes
    WHERE id_estudiante = p_id_estudiante;

    RETURN FOUND;
END;
$$;



-- ============================================================
-- 5. ASISTENCIAS
-- ============================================================

CREATE OR REPLACE FUNCTION sp_asistencias_obtener()
RETURNS SETOF Asistencias
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Asistencias;
END;
$$;


CREATE OR REPLACE FUNCTION sp_asistencias_crear(
    p_id_viaje INTEGER,
    p_id_estudiante INTEGER,
    p_estado_abordaje VARCHAR(10),
    p_hora_abordaje TIMESTAMP,
    p_estado_descenso VARCHAR(20),
    p_hora_descenso TIMESTAMP
)
RETURNS Asistencias
LANGUAGE plpgsql
AS $$
DECLARE
    v_asistencia Asistencias;
BEGIN
    INSERT INTO Asistencias(
        id_viaje,
        id_estudiante,
        estado_abordaje,
        hora_abordaje,
        estado_descenso,
        hora_descenso
    )
    VALUES (
        p_id_viaje,
        p_id_estudiante,
        p_estado_abordaje,
        p_hora_abordaje,
        p_estado_descenso,
        p_hora_descenso
    )
    RETURNING * INTO v_asistencia;

    RETURN v_asistencia;
END;
$$;


CREATE OR REPLACE FUNCTION sp_asistencias_buscar(
    p_id_asistencia INTEGER
)
RETURNS SETOF Asistencias
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Asistencias
    WHERE id_asistencia = p_id_asistencia;
END;
$$;


CREATE OR REPLACE FUNCTION sp_asistencias_editar(
    p_id_asistencia INTEGER,
    p_id_viaje INTEGER,
    p_id_estudiante INTEGER,
    p_estado_abordaje VARCHAR(10),
    p_hora_abordaje TIMESTAMP,
    p_estado_descenso VARCHAR(20),
    p_hora_descenso TIMESTAMP
)
RETURNS Asistencias
LANGUAGE plpgsql
AS $$
DECLARE
    v_asistencia Asistencias;
BEGIN
    UPDATE Asistencias
    SET id_viaje = p_id_viaje,
        id_estudiante = p_id_estudiante,
        estado_abordaje = p_estado_abordaje,
        hora_abordaje = p_hora_abordaje,
        estado_descenso = p_estado_descenso,
        hora_descenso = p_hora_descenso
    WHERE id_asistencia = p_id_asistencia
    RETURNING * INTO v_asistencia;

    RETURN v_asistencia;
END;
$$;


CREATE OR REPLACE FUNCTION sp_asistencias_eliminar(
    p_id_asistencia INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Asistencias
    WHERE id_asistencia = p_id_asistencia;

    RETURN FOUND;
END;
$$;



-- ============================================================
-- 6. PROVEEDORES
-- ============================================================

CREATE OR REPLACE FUNCTION sp_proveedores_obtener()
RETURNS SETOF Proveedores
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Proveedores;
END;
$$;


CREATE OR REPLACE FUNCTION sp_proveedores_crear(
    p_id_usuario INTEGER,
    p_nombre_negocio VARCHAR(150),
    p_direccion VARCHAR(255),
    p_telefono_contacto VARCHAR(20)
)
RETURNS Proveedores
LANGUAGE plpgsql
AS $$
DECLARE
    v_proveedor Proveedores;
BEGIN
    INSERT INTO Proveedores(
        id_usuario,
        nombre_negocio,
        direccion,
        telefono_contacto
    )
    VALUES (
        p_id_usuario,
        p_nombre_negocio,
        p_direccion,
        p_telefono_contacto
    )
    RETURNING * INTO v_proveedor;

    RETURN v_proveedor;
END;
$$;


CREATE OR REPLACE FUNCTION sp_proveedores_buscar(
    p_id_proveedor INTEGER
)
RETURNS SETOF Proveedores
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Proveedores
    WHERE id_proveedor = p_id_proveedor;
END;
$$;


CREATE OR REPLACE FUNCTION sp_proveedores_editar(
    p_id_proveedor INTEGER,
    p_id_usuario INTEGER,
    p_nombre_negocio VARCHAR(150),
    p_direccion VARCHAR(255),
    p_telefono_contacto VARCHAR(20)
)
RETURNS Proveedores
LANGUAGE plpgsql
AS $$
DECLARE
    v_proveedor Proveedores;
BEGIN
    UPDATE Proveedores
    SET id_usuario = p_id_usuario,
        nombre_negocio = p_nombre_negocio,
        direccion = p_direccion,
        telefono_contacto = p_telefono_contacto
    WHERE id_proveedor = p_id_proveedor
    RETURNING * INTO v_proveedor;

    RETURN v_proveedor;
END;
$$;


CREATE OR REPLACE FUNCTION sp_proveedores_eliminar(
    p_id_proveedor INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Proveedores
    WHERE id_proveedor = p_id_proveedor;

    RETURN FOUND;
END;
$$;

-- ============================================================
-- 7. RUTAS
-- ============================================================

CREATE OR REPLACE FUNCTION sp_rutas_obtener()
RETURNS SETOF Rutas
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Rutas;
END;
$$;


CREATE OR REPLACE FUNCTION sp_rutas_crear(
    p_id_servicio INTEGER,
    p_id_vehiculo INTEGER,
    p_id_chofer INTEGER,
    p_nombre VARCHAR(150),
    p_hora_inicio_estimada TIME,
    p_hora_fin_estimada TIME,
    p_estado VARCHAR(10)
)
RETURNS Rutas
LANGUAGE plpgsql
AS $$
DECLARE
    v_ruta Rutas;
BEGIN
    INSERT INTO Rutas(
        id_servicio,
        id_vehiculo,
        id_chofer,
        nombre,
        hora_inicio_estimada,
        hora_fin_estimada,
        estado
    )
    VALUES (
        p_id_servicio,
        p_id_vehiculo,
        p_id_chofer,
        p_nombre,
        p_hora_inicio_estimada,
        p_hora_fin_estimada,
        p_estado
    )
    RETURNING * INTO v_ruta;

    RETURN v_ruta;
END;
$$;


CREATE OR REPLACE FUNCTION sp_rutas_buscar(
    p_id_ruta INTEGER
)
RETURNS SETOF Rutas
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Rutas
    WHERE id_ruta = p_id_ruta;
END;
$$;


CREATE OR REPLACE FUNCTION sp_rutas_editar(
    p_id_ruta INTEGER,
    p_id_servicio INTEGER,
    p_id_vehiculo INTEGER,
    p_id_chofer INTEGER,
    p_nombre VARCHAR(150),
    p_hora_inicio_estimada TIME,
    p_hora_fin_estimada TIME,
    p_estado VARCHAR(10)
)
RETURNS Rutas
LANGUAGE plpgsql
AS $$
DECLARE
    v_ruta Rutas;
BEGIN
    UPDATE Rutas
    SET id_servicio = p_id_servicio,
        id_vehiculo = p_id_vehiculo,
        id_chofer = p_id_chofer,
        nombre = p_nombre,
        hora_inicio_estimada = p_hora_inicio_estimada,
        hora_fin_estimada = p_hora_fin_estimada,
        estado = p_estado
    WHERE id_ruta = p_id_ruta
    RETURNING * INTO v_ruta;

    RETURN v_ruta;
END;
$$;


CREATE OR REPLACE FUNCTION sp_rutas_eliminar(
    p_id_ruta INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Rutas
    WHERE id_ruta = p_id_ruta;

    RETURN FOUND;
END;
$$;

-- ============================================================
-- 8. INCIDENCIAS
-- ============================================================

CREATE OR REPLACE FUNCTION sp_incidencias_obtener()
RETURNS SETOF Incidencias
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Incidencias;
END;
$$;


CREATE OR REPLACE FUNCTION sp_incidencias_crear(
    p_id_viaje INTEGER,
    p_id_ruta INTEGER,
    p_id_usuario_reporta INTEGER,
    p_titulo VARCHAR(40),
    p_descripcion TEXT,
    p_latitud DECIMAL(10,7),
    p_longitud DECIMAL(10,7),
    p_estado VARCHAR(7)
)
RETURNS Incidencias
LANGUAGE plpgsql
AS $$
DECLARE
    v_incidencia Incidencias;
BEGIN
    INSERT INTO Incidencias(
        id_viaje,
        id_ruta,
        id_usuario_reporta,
        titulo,
        descripcion,
        latitud,
        longitud,
        estado
    )
    VALUES (
        p_id_viaje,
        p_id_ruta,
        p_id_usuario_reporta,
        p_titulo,
        p_descripcion,
        p_latitud,
        p_longitud,
        p_estado
    )
    RETURNING * INTO v_incidencia;

    RETURN v_incidencia;
END;
$$;


CREATE OR REPLACE FUNCTION sp_incidencias_buscar(
    p_id_incidencia INTEGER
)
RETURNS SETOF Incidencias
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM Incidencias
    WHERE id_incidencia = p_id_incidencia;
END;
$$;


CREATE OR REPLACE FUNCTION sp_incidencias_editar(
    p_id_incidencia INTEGER,
    p_id_viaje INTEGER,
    p_id_ruta INTEGER,
    p_id_usuario_reporta INTEGER,
    p_titulo VARCHAR(40),
    p_descripcion TEXT,
    p_latitud DECIMAL(10,7),
    p_longitud DECIMAL(10,7),
    p_estado VARCHAR(7)
)
RETURNS Incidencias
LANGUAGE plpgsql
AS $$
DECLARE
    v_incidencia Incidencias;
BEGIN
    UPDATE Incidencias
    SET id_viaje = p_id_viaje,
        id_ruta = p_id_ruta,
        id_usuario_reporta = p_id_usuario_reporta,
        titulo = p_titulo,
        descripcion = p_descripcion,
        latitud = p_latitud,
        longitud = p_longitud,
        estado = p_estado
    WHERE id_incidencia = p_id_incidencia
    RETURNING * INTO v_incidencia;

    RETURN v_incidencia;
END;
$$;


CREATE OR REPLACE FUNCTION sp_incidencias_eliminar(
    p_id_incidencia INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Incidencias
    WHERE id_incidencia = p_id_incidencia;

    RETURN FOUND;
END;
$$;
   
-- ASIGNACIONES RUTAS
-- Listar 
CREATE OR REPLACE FUNCTION sp_asignaciones_ruta_listar()
RETURNS SETOF asignaciones_ruta AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM asignaciones_ruta;
END;
$$ LANGUAGE plpgsql;

-- Agregar
CREATE OR REPLACE FUNCTION sp_asignaciones_ruta_agregar(
    p_id_estudiante INT,
    p_id_ruta INT,
    p_id_parada_recogida INT,
    p_id_parada_descenso INT
)
RETURNS SETOF asignaciones_ruta AS $$
BEGIN
    RETURN QUERY
    INSERT INTO asignaciones_ruta(id_estudiante, id_ruta, id_parada_recogida, id_parada_descenso) 
    VALUES (p_id_estudiante, p_id_ruta, p_id_parada_recogida, p_id_parada_descenso)
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- BUSCAR
CREATE OR REPLACE FUNCTION sp_asignaciones_ruta_buscar_por_id(p_id_asignacion INT)
RETURNS SETOF asignaciones_ruta AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM asignaciones_ruta WHERE id_asignacion = p_id_asignacion;
END;
$$ LANGUAGE plpgsql;

-- ACTUALIZAR
CREATE OR REPLACE FUNCTION sp_asignaciones_ruta_actualizar(
    p_id_estudiante INT,
    p_id_ruta INT,
    p_id_parada_recogida INT,
    p_id_parada_descenso INT,
    p_id_asignacion INT
)
RETURNS SETOF asignaciones_ruta AS $$
BEGIN
    RETURN QUERY
    UPDATE asignaciones_ruta 
    SET id_estudiante = p_id_estudiante, 
        id_ruta = p_id_ruta, 
        id_parada_recogida = p_id_parada_recogida, 
        id_parada_descenso = p_id_parada_descenso 
    WHERE id_asignacion = p_id_asignacion
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- ELIMINAR 
CREATE OR REPLACE FUNCTION sp_asignaciones_ruta_eliminar(p_id_asignacion INT)
RETURNS INTEGER AS $$
DECLARE
    filas_afectadas INTEGER;
BEGIN
    DELETE FROM asignaciones_ruta WHERE id_asignacion = p_id_asignacion;
    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
    RETURN filas_afectadas;
END;
$$ LANGUAGE plpgsql;


-- ========= NOTIFICACIONES ===================
-- Listar Notificaciones
CREATE OR REPLACE FUNCTION sp_notificaciones_listar()
RETURNS SETOF notificaciones AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM notificaciones;
END;
$$ LANGUAGE plpgsql;

-- Buscar Notificación por ID
CREATE OR REPLACE FUNCTION sp_notificaciones_buscar_por_id(p_id_notificacion INT)
RETURNS SETOF notificaciones AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM notificaciones WHERE id_notificacion = p_id_notificacion;
END;
$$ LANGUAGE plpgsql;

-- Agregar Notificación
CREATE OR REPLACE FUNCTION sp_notificaciones_agregar(
    p_id_usuario INT,
    p_id_incidencia INT,
    p_id_asistencia INT,
    p_tipo VARCHAR,
    p_titulo VARCHAR,
    p_mensaje TEXT,
    p_leida BOOLEAN,
    p_fecha_envio TIMESTAMP
)
RETURNS SETOF notificaciones AS $$
BEGIN
    RETURN QUERY
    INSERT INTO notificaciones(id_usuario, id_incidencia, id_asistencia, tipo, titulo, mensaje, leida, fecha_envio) 
    VALUES (p_id_usuario, p_id_incidencia, p_id_asistencia, p_tipo, p_titulo, p_mensaje, p_leida, p_fecha_envio)
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Actualizar Notificación
CREATE OR REPLACE FUNCTION sp_notificaciones_actualizar(
    p_id_usuario INT,
    p_id_incidencia INT,
    p_id_asistencia INT,
    p_tipo VARCHAR,
    p_titulo VARCHAR,
    p_mensaje TEXT,
    p_leida BOOLEAN,
    p_fecha_envio TIMESTAMP,
    p_id_notificacion INT
)
RETURNS SETOF notificaciones AS $$
BEGIN
    RETURN QUERY
    UPDATE notificaciones 
    SET id_usuario = p_id_usuario, 
        id_incidencia = p_id_incidencia, 
        id_asistencia = p_id_asistencia, 
        tipo = p_tipo, 
        titulo = p_titulo, 
        mensaje = p_mensaje, 
        leida = p_leida, 
        fecha_envio = p_fecha_envio 
    WHERE id_notificacion = p_id_notificacion
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Eliminar Notificación
CREATE OR REPLACE FUNCTION sp_notificaciones_eliminar(p_id_notificacion INT)
RETURNS INTEGER AS $$
DECLARE
    filas_afectadas INTEGER;
BEGIN
    DELETE FROM notificaciones WHERE id_notificacion = p_id_notificacion;
    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
    RETURN filas_afectadas;
END;
$$ LANGUAGE plpgsql;



-- ======== PAGOS ================
-- Listar Pagos
CREATE OR REPLACE FUNCTION sp_pagos_listar()
RETURNS SETOF pagos AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM pagos;
END;
$$ LANGUAGE plpgsql;

-- Buscar Pago por ID
CREATE OR REPLACE FUNCTION sp_pagos_buscar_por_id(p_id_pago INT)
RETURNS SETOF pagos AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM pagos WHERE id_pago = p_id_pago;
END;
$$ LANGUAGE plpgsql;

-- Agregar Pago
CREATE OR REPLACE FUNCTION sp_pagos_agregar(
    p_id_estudiante INT,
    p_id_servicio INT,
    p_periodo_mes INT,     
    p_periodo_anio INT,
    p_monto DECIMAL,       
    p_metodo_pago VARCHAR,
    p_referencia_pago VARCHAR,
    p_foto_comprobante TEXT,
    p_estado VARCHAR,
    p_fecha_pago_limite DATE,
    p_fecha_verificacion DATE,
    p_verificado_por INT,
    p_observaciones TEXT
)
RETURNS SETOF pagos AS $$
BEGIN
    RETURN QUERY
    INSERT INTO pagos(
        id_estudiante, id_servicio, periodo_mes, periodo_anio, monto, 
        metodo_pago, referencia_pago, foto_comprobante, estado, 
        fecha_pago_limite, fecha_verificacion, verificado_por, observaciones
    ) 
    VALUES (
        p_id_estudiante, p_id_servicio, p_periodo_mes, p_periodo_anio, p_monto, 
        p_metodo_pago, p_referencia_pago, p_foto_comprobante, p_estado, 
        p_fecha_pago_limite, p_fecha_verificacion, p_verificado_por, p_observaciones
    )
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Actualizar Pago
CREATE OR REPLACE FUNCTION sp_pagos_actualizar(
    p_id_estudiante INT,
    p_id_servicio INT,
    p_periodo_mes INT,
    p_periodo_anio INT,
    p_monto DECIMAL,
    p_metodo_pago VARCHAR,
    p_referencia_pago VARCHAR,
    p_foto_comprobante TEXT,
    p_estado VARCHAR,
    p_fecha_pago_limite DATE,
    p_fecha_verificacion DATE,
    p_verificado_por INT,
    p_observaciones TEXT,
    p_id_pago INT
)
RETURNS SETOF pagos AS $$
BEGIN
    RETURN QUERY
    UPDATE pagos 
    SET id_estudiante = p_id_estudiante, 
        id_servicio = p_id_servicio, 
        periodo_mes = p_periodo_mes, 
        periodo_anio = p_periodo_anio, 
        monto = p_monto, 
        metodo_pago = p_metodo_pago, 
        referencia_pago = p_referencia_pago, 
        foto_comprobante = p_foto_comprobante, 
        estado = p_estado, 
        fecha_pago_limite = p_fecha_pago_limite, 
        fecha_verificacion = p_fecha_verificacion, 
        verificado_por = p_verificado_por, 
        observaciones = p_observaciones 
    WHERE id_pago = p_id_pago
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Eliminar Pago
CREATE OR REPLACE FUNCTION sp_pagos_eliminar(p_id_pago INT)
RETURNS INTEGER AS $$
DECLARE
    filas_afectadas INTEGER;
BEGIN
    DELETE FROM pagos WHERE id_pago = p_id_pago;
    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
    RETURN filas_afectadas;
END;
$$ LANGUAGE plpgsql;


-- ============ PARADAS =============
-- Listar Paradas
CREATE OR REPLACE FUNCTION sp_paradas_listar()
RETURNS SETOF paradas AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM paradas;
END;
$$ LANGUAGE plpgsql;

-- Buscar Parada por ID
CREATE OR REPLACE FUNCTION sp_paradas_buscar_por_id(p_id_parada INT)
RETURNS SETOF paradas AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM paradas WHERE id_parada = p_id_parada;
END;
$$ LANGUAGE plpgsql;

-- Agregar Parada
CREATE OR REPLACE FUNCTION sp_paradas_agregar(
    p_nombre VARCHAR,
    p_direccion VARCHAR,
    p_latitud DECIMAL,
    p_longitud DECIMAL
)
RETURNS SETOF paradas AS $$
BEGIN
    RETURN QUERY
    INSERT INTO paradas(nombre, direccion, latitud, longitud) 
    VALUES (p_nombre, p_direccion, p_latitud, p_longitud)
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Actualizar Parada
CREATE OR REPLACE FUNCTION sp_paradas_actualizar(
    p_nombre VARCHAR,
    p_direccion VARCHAR,
    p_latitud DECIMAL,
    p_longitud DECIMAL,
    p_id_parada INT
)
RETURNS SETOF paradas AS $$
BEGIN
    RETURN QUERY
    UPDATE paradas 
    SET nombre = p_nombre, 
        direccion = p_direccion, 
        latitud = p_latitud, 
        longitud = p_longitud
    WHERE id_parada = p_id_parada
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Eliminar Parada
CREATE OR REPLACE FUNCTION sp_paradas_eliminar(p_id_parada INT)
RETURNS INTEGER AS $$
DECLARE
    filas_afectadas INTEGER;
BEGIN
    DELETE FROM paradas WHERE id_parada = p_id_parada;
    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
    RETURN filas_afectadas;
END;
$$ LANGUAGE plpgsql;


-- ========= RUTA PARADA ==========
-- Listar Ruta Parada
CREATE OR REPLACE FUNCTION sp_ruta_parada_listar()
RETURNS SETOF ruta_parada AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM ruta_parada;
END;
$$ LANGUAGE plpgsql;

-- Buscar Ruta Parada por ID
CREATE OR REPLACE FUNCTION sp_ruta_parada_buscar_por_id(p_id_ruta_parada INT)
RETURNS SETOF ruta_parada AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM ruta_parada WHERE id_ruta_parada = p_id_ruta_parada;
END;
$$ LANGUAGE plpgsql;

-- Agregar Ruta Parada
CREATE OR REPLACE FUNCTION sp_ruta_parada_agregar(
    p_id_ruta INT,
    p_id_parada INT,
    p_orden_parada INT,
    p_minutos_estimados INT,
    p_hora_estimada TIME
)
RETURNS SETOF ruta_parada AS $$
BEGIN
    RETURN QUERY
    INSERT INTO ruta_parada(id_ruta, id_parada, orden_parada, minutos_estimados, hora_estimada) 
    VALUES (p_id_ruta, p_id_parada, p_orden_parada, p_minutos_estimados, p_hora_estimada)
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Actualizar Ruta Parada
CREATE OR REPLACE FUNCTION sp_ruta_parada_actualizar(
    p_id_ruta INT,
    p_id_parada INT,
    p_orden_parada INT,
    p_minutos_estimados INT,
    p_hora_estimada TIME,
    p_id_ruta_parada INT
)
RETURNS SETOF ruta_parada AS $$
BEGIN
    RETURN QUERY
    UPDATE ruta_parada 
    SET id_ruta = p_id_ruta, 
        id_parada = p_id_parada, 
        orden_parada = p_orden_parada, 
        minutos_estimados = p_minutos_estimados,
        hora_estimada = p_hora_estimada
    WHERE id_ruta_parada = p_id_ruta_parada
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Eliminar Ruta Parada
CREATE OR REPLACE FUNCTION sp_ruta_parada_eliminar(p_id_ruta_parada INT)
RETURNS INTEGER AS $$
DECLARE
    filas_afectadas INTEGER;
BEGIN
    DELETE FROM ruta_parada WHERE id_ruta_parada = p_id_ruta_parada;
    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
    RETURN filas_afectadas;
END;
$$ LANGUAGE plpgsql;


-- ========== SERVICIOS ===========
-- Listar Servicios
CREATE OR REPLACE FUNCTION sp_servicios_listar()
RETURNS SETOF servicios AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM servicios;
END;
$$ LANGUAGE plpgsql;

-- Buscar Servicio por ID
CREATE OR REPLACE FUNCTION sp_servicios_buscar_por_id(p_id_servicio INT)
RETURNS SETOF servicios AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM servicios WHERE id_servicio = p_id_servicio;
END;
$$ LANGUAGE plpgsql;

-- Agregar Servicio
CREATE OR REPLACE FUNCTION sp_servicios_agregar(
    p_id_proveedor INT,
    p_nombre VARCHAR,
    p_descripcion TEXT,
    p_precio_mensual DECIMAL,
    p_estado VARCHAR,
    p_fecha_creacion TIMESTAMP
)
RETURNS SETOF servicios AS $$
BEGIN
    RETURN QUERY
    INSERT INTO servicios(id_proveedor, nombre, descripcion, precio_mensual, estado, fecha_creacion) 
    VALUES (p_id_proveedor, p_nombre, p_descripcion, p_precio_mensual, p_estado, p_fecha_creacion)
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Actualizar Servicio
CREATE OR REPLACE FUNCTION sp_servicios_actualizar(
    p_id_proveedor INT,
    p_nombre VARCHAR,
    p_descripcion TEXT,
    p_precio_mensual DECIMAL,
    p_estado VARCHAR,
    p_fecha_creacion TIMESTAMP,
    p_id_servicio INT
)
RETURNS SETOF servicios AS $$
BEGIN
    RETURN QUERY
    UPDATE servicios 
    SET id_proveedor = p_id_proveedor, 
        nombre = p_nombre, 
        descripcion = p_descripcion, 
        precio_mensual = p_precio_mensual, 
        estado = p_estado, 
        fecha_creacion = p_fecha_creacion 
    WHERE id_servicio = p_id_servicio
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Eliminar Servicio
CREATE OR REPLACE FUNCTION sp_servicios_eliminar(p_id_servicio INT)
RETURNS INTEGER AS $$
DECLARE
    filas_afectadas INTEGER;
BEGIN
    DELETE FROM servicios WHERE id_servicio = p_id_servicio;
    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
    RETURN filas_afectadas;
END;
$$ LANGUAGE plpgsql;


-- =========== UBICACIONES BUS ========
-- Listar Ubicaciones de Bus
CREATE OR REPLACE FUNCTION sp_ubicaciones_bus_listar()
RETURNS SETOF ubicaciones_bus AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM ubicaciones_bus;
END;
$$ LANGUAGE plpgsql;

-- Buscar Ubicación de Bus por ID
CREATE OR REPLACE FUNCTION sp_ubicaciones_bus_buscar_por_id(p_id_ubicacion INT)
RETURNS SETOF ubicaciones_bus AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM ubicaciones_bus WHERE id_ubicacion = p_id_ubicacion;
END;
$$ LANGUAGE plpgsql;

-- Agregar Ubicación de Bus
CREATE OR REPLACE FUNCTION sp_ubicaciones_bus_agregar(
    p_id_viaje INT,
    p_latitud DECIMAL,
    p_longitud DECIMAL,
    p_velocidad DECIMAL
)
RETURNS SETOF ubicaciones_bus AS $$
BEGIN
    RETURN QUERY
    INSERT INTO ubicaciones_bus(id_viaje, latitud, longitud, velocidad) 
    VALUES (p_id_viaje, p_latitud, p_longitud, p_velocidad)
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Actualizar Ubicación de Bus
CREATE OR REPLACE FUNCTION sp_ubicaciones_bus_actualizar(
    p_id_viaje INT,
    p_latitud DECIMAL,
    p_longitud DECIMAL,
    p_velocidad DECIMAL,
    p_id_ubicacion INT
)
RETURNS SETOF ubicaciones_bus AS $$
BEGIN
    RETURN QUERY
    UPDATE ubicaciones_bus 
    SET id_viaje = p_id_viaje, 
        latitud = p_latitud, 
        longitud = p_longitud, 
        velocidad = p_velocidad 
    WHERE id_ubicacion = p_id_ubicacion
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Eliminar Ubicación de Bus
CREATE OR REPLACE FUNCTION sp_ubicaciones_bus_eliminar(p_id_ubicacion INT)
RETURNS INTEGER AS $$
DECLARE
    filas_afectadas INTEGER;
BEGIN
    DELETE FROM ubicaciones_bus WHERE id_ubicacion = p_id_ubicacion;
    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
    RETURN filas_afectadas;
END;
$$ LANGUAGE plpgsql;


-- ========= USUARIOS ===========
-- Listar Usuarios
CREATE OR REPLACE FUNCTION sp_usuarios_listar()
RETURNS SETOF usuarios AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM usuarios;
END;
$$ LANGUAGE plpgsql;

-- Buscar Usuario por ID
CREATE OR REPLACE FUNCTION sp_usuarios_buscar_por_id(p_id_usuario INT)
RETURNS SETOF usuarios AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM usuarios WHERE id_usuario = p_id_usuario;
END;
$$ LANGUAGE plpgsql;

-- Buscar Usuario por Correo (Utilizado para Login)
CREATE OR REPLACE FUNCTION sp_usuarios_buscar_por_correo(p_correo VARCHAR)
RETURNS SETOF usuarios AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM usuarios WHERE correo = p_correo;
END;
$$ LANGUAGE plpgsql;

-- Agregar Usuario
CREATE OR REPLACE FUNCTION sp_usuarios_agregar(
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_correo VARCHAR,
    p_password VARCHAR,
    p_telefono VARCHAR,
    p_foto_usuario TEXT,
    p_rol VARCHAR,
    p_correo_verificado BOOLEAN
)
RETURNS SETOF usuarios AS $$
BEGIN
    RETURN QUERY
    INSERT INTO usuarios(nombre, apellido, correo, password, telefono, foto_usuario, rol, correo_verificado) 
    VALUES (p_nombre, p_apellido, p_correo, p_password, p_telefono, p_foto_usuario, p_rol, p_correo_verificado)
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Actualizar Usuario
CREATE OR REPLACE FUNCTION sp_usuarios_actualizar(
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_correo VARCHAR,
    p_password VARCHAR,
    p_telefono VARCHAR,
    p_foto_usuario TEXT,
    p_rol VARCHAR,
    p_correo_verificado BOOLEAN,
    p_id_usuario INT
)
RETURNS SETOF usuarios AS $$
BEGIN
    RETURN QUERY
    UPDATE usuarios 
    SET nombre = p_nombre, 
        apellido = p_apellido, 
        correo = p_correo, 
        password = p_password, 
        telefono = p_telefono, 
        foto_usuario = p_foto_usuario, 
        rol = p_rol, 
        correo_verificado = p_correo_verificado 
    WHERE id_usuario = p_id_usuario
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Eliminar Usuario
CREATE OR REPLACE FUNCTION sp_usuarios_eliminar(p_id_usuario INT)
RETURNS INTEGER AS $$
DECLARE
    filas_afectadas INTEGER;
BEGIN
    DELETE FROM usuarios WHERE id_usuario = p_id_usuario;
    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
    RETURN filas_afectadas;
END;
$$ LANGUAGE plpgsql;


-- ======== VEHICULOS ===========
-- Listar Vehículos
CREATE OR REPLACE FUNCTION sp_vehiculos_listar()
RETURNS SETOF vehiculos AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM vehiculos;
END;
$$ LANGUAGE plpgsql;

-- Buscar Vehículo por ID
CREATE OR REPLACE FUNCTION sp_vehiculos_buscar_por_id(p_id_vehiculo INT)
RETURNS SETOF vehiculos AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM vehiculos WHERE id_vehiculo = p_id_vehiculo;
END;
$$ LANGUAGE plpgsql;

-- Agregar Vehículo
CREATE OR REPLACE FUNCTION sp_vehiculos_agregar(
    p_id_proveedor INT,
    p_placa VARCHAR,
    p_foto_vehiculo TEXT,
    p_estado VARCHAR
)
RETURNS SETOF vehiculos AS $$
BEGIN
    RETURN QUERY
    INSERT INTO vehiculos(id_proveedor, placa, foto_vehiculo, estado) 
    VALUES (p_id_proveedor, p_placa, p_foto_vehiculo, p_estado)
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Actualizar Vehículo
CREATE OR REPLACE FUNCTION sp_vehiculos_actualizar(
    p_id_proveedor INT,
    p_placa VARCHAR,
    p_foto_vehiculo TEXT,
    p_estado VARCHAR,
    p_id_vehiculo INT
)
RETURNS SETOF vehiculos AS $$
BEGIN
    RETURN QUERY
    UPDATE vehiculos 
    SET id_proveedor = p_id_proveedor, 
        placa = p_placa, 
        foto_vehiculo = p_foto_vehiculo, 
        estado = p_estado 
    WHERE id_vehiculo = p_id_vehiculo
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Eliminar Vehículo
CREATE OR REPLACE FUNCTION sp_vehiculos_eliminar(p_id_vehiculo INT)
RETURNS INTEGER AS $$
DECLARE
    filas_afectadas INTEGER;
BEGIN
    DELETE FROM vehiculos WHERE id_vehiculo = p_id_vehiculo;
    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
    RETURN filas_afectadas;
END;
$$ LANGUAGE plpgsql;


-- ========= VIAJES =============
-- Listar Viajes
CREATE OR REPLACE FUNCTION sp_viajes_listar()
RETURNS SETOF viajes AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM viajes;
END;
$$ LANGUAGE plpgsql;

-- Buscar Viaje por ID
CREATE OR REPLACE FUNCTION sp_viajes_buscar_por_id(p_id_viaje INT)
RETURNS SETOF viajes AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM viajes WHERE id_viaje = p_id_viaje;
END;
$$ LANGUAGE plpgsql;

-- Agregar Viaje
CREATE OR REPLACE FUNCTION sp_viajes_agregar(
    p_id_ruta INT,
    p_id_chofer INT,
    p_id_vehiculo INT,
    p_fecha_viaje DATE,
    p_hora_inicio TIME,
    p_hora_fin TIME,
    p_estado VARCHAR
)
RETURNS SETOF viajes AS $$
BEGIN
    RETURN QUERY
    INSERT INTO viajes(id_ruta, id_chofer, id_vehiculo, fecha_viaje, hora_inicio, hora_fin, estado) 
    VALUES (p_id_ruta, p_id_chofer, p_id_vehiculo, p_fecha_viaje, p_hora_inicio, p_hora_fin, p_estado)
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Actualizar Viaje
CREATE OR REPLACE FUNCTION sp_viajes_actualizar(
    p_id_ruta INT,
    p_id_chofer INT,
    p_id_vehiculo INT,
    p_fecha_viaje DATE,
    p_hora_inicio TIME,
    p_hora_fin TIME,
    p_estado VARCHAR,
    p_id_viaje INT
)
RETURNS SETOF viajes AS $$
BEGIN
    RETURN QUERY
    UPDATE viajes 
    SET id_ruta = p_id_ruta, 
        id_chofer = p_id_chofer, 
        id_vehiculo = p_id_vehiculo, 
        fecha_viaje = p_fecha_viaje, 
        hora_inicio = p_hora_inicio, 
        hora_fin = p_hora_fin, 
        estado = p_estado 
    WHERE id_viaje = p_id_viaje
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Eliminar Viaje
CREATE OR REPLACE FUNCTION sp_viajes_eliminar(p_id_viaje INT)
RETURNS INTEGER AS $$
DECLARE
    filas_afectadas INTEGER;
BEGIN
    DELETE FROM viajes WHERE id_viaje = p_id_viaje;
    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
    RETURN filas_afectadas;
END;
$$ LANGUAGE plpgsql;
