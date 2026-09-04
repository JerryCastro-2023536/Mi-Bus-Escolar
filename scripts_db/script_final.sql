-- ============================================================
-- 1. USUARIOS
-- ============================================================

CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL UNIQUE,
    foto_usuario TEXT,

    rol VARCHAR(20) NOT NULL
        CHECK (rol IN (
            'ADMINISTRADOR',
            'PROVEEDOR',
            'CHOFER',
            'USUARIO'
        )),

    correo_verificado BOOLEAN NOT NULL DEFAULT FALSE,

    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 2. PROVEEDORES
-- ============================================================

CREATE TABLE IF NOT EXISTS Proveedores (
    id_proveedor INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL UNIQUE,
    nombre_negocio VARCHAR(150) NOT NULL,
    direccion VARCHAR(255),
    telefono_contacto VARCHAR(20) NOT NULL UNIQUE,

    CONSTRAINT fk_proveedores_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- ============================================================
-- 3. VALORACIONES
-- ============================================================

CREATE TABLE IF NOT EXISTS Valoraciones (
    id_valoracion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_proveedor INTEGER NOT NULL,
    comentario TEXT,
    calificacion DOUBLE PRECISION NOT NULL,

    CONSTRAINT fk_valoraciones_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES Proveedores(id_proveedor)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- ============================================================
-- 4. CHOFERES
-- ============================================================

CREATE TABLE IF NOT EXISTS Choferes (
    id_chofer INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL UNIQUE,
    telefono_contacto VARCHAR(20) NOT NULL UNIQUE,

    estado VARCHAR(10) NOT NULL DEFAULT 'ACTIVO'
        CHECK (estado IN ('ACTIVO', 'INACTIVO')),

    CONSTRAINT fk_choferes_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- ============================================================
-- 5. COLEGIOS
-- ============================================================

CREATE TABLE IF NOT EXISTS Colegios (
    id_colegio INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    direccion VARCHAR(255),
    telefono_contacto VARCHAR(20)
);


-- ============================================================
-- 6. ESTUDIANTES
-- ============================================================

CREATE TABLE IF NOT EXISTS Estudiantes (
    id_estudiante INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario_tutor INTEGER NOT NULL,
    id_colegio INTEGER,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    foto_estudiante TEXT,
    grado VARCHAR(50),

    CONSTRAINT fk_estudiantes_tutor
        FOREIGN KEY (id_usuario_tutor)
        REFERENCES Usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_estudiantes_colegio
        FOREIGN KEY (id_colegio)
        REFERENCES Colegios(id_colegio)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- ============================================================
-- 7. VEHICULOS
-- ============================================================

CREATE TABLE IF NOT EXISTS Vehiculos (
    id_vehiculo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_proveedor INTEGER NOT NULL,
    placa VARCHAR(20) NOT NULL UNIQUE,
    foto_vehiculo TEXT,

    estado VARCHAR(10) NOT NULL DEFAULT 'ACTIVO'
        CHECK (estado IN ('ACTIVO', 'INACTIVO')),

    CONSTRAINT fk_vehiculos_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES Proveedores(id_proveedor)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- ============================================================
-- 8. SERVICIOS
-- ============================================================

CREATE TABLE IF NOT EXISTS Servicios (
    id_servicio INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_proveedor INTEGER NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_mensual DECIMAL(10,2) NOT NULL,

    estado VARCHAR(10) NOT NULL DEFAULT 'ACTIVO'
        CHECK (estado IN ('ACTIVO', 'INACTIVO')),

    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_servicios_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES Proveedores(id_proveedor)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- ============================================================
-- 9. RUTAS
-- ============================================================

CREATE TABLE IF NOT EXISTS Rutas (
    id_ruta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_servicio INTEGER NOT NULL,
    id_vehiculo INTEGER,
    id_chofer INTEGER,
    nombre VARCHAR(150) NOT NULL,
    hora_inicio_estimada TIME,
    hora_fin_estimada TIME,

    estado VARCHAR(10) NOT NULL DEFAULT 'ACTIVO'
        CHECK (estado IN ('ACTIVO', 'INACTIVO')),

    CONSTRAINT fk_rutas_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES Servicios(id_servicio)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_rutas_vehiculo
        FOREIGN KEY (id_vehiculo)
        REFERENCES Vehiculos(id_vehiculo)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_rutas_chofer
        FOREIGN KEY (id_chofer)
        REFERENCES Choferes(id_chofer)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- ============================================================
-- 10. PARADAS
-- ============================================================

CREATE TABLE Paradas (
    id_parada INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    latitud DECIMAL(10,7),
    longitud DECIMAL(10,7)
);

-- ============================================================
-- 11. RELACIÓN RUTA - PARADA
-- ============================================================

CREATE TABLE Ruta_Parada (
    id_ruta_parada INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_ruta INTEGER NOT NULL,
    id_parada INTEGER NOT NULL,
    orden_parada INTEGER NOT NULL,
    minutos_estimados INTEGER,
    hora_estimada TIME,

    CONSTRAINT fk_ruta_parada_ruta
        FOREIGN KEY (id_ruta)
        REFERENCES Rutas(id_ruta)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_ruta_parada_parada
        FOREIGN KEY (id_parada)
        REFERENCES Paradas(id_parada)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT uq_ruta_orden
        UNIQUE (id_ruta, orden_parada)
);

-- ============================================================
-- 12. ASIGNACIONES DE ESTUDIANTES A RUTAS
-- ============================================================

CREATE TABLE Asignaciones_Ruta (
    id_asignacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_estudiante INTEGER NOT NULL,
    id_ruta INTEGER NOT NULL,
    id_parada_recogida INTEGER,
    id_parada_descenso INTEGER,

    CONSTRAINT fk_asignaciones_estudiante
        FOREIGN KEY (id_estudiante)
        REFERENCES Estudiantes(id_estudiante)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_asignaciones_ruta
        FOREIGN KEY (id_ruta)
        REFERENCES Rutas(id_ruta)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_asignaciones_parada_recogida
        FOREIGN KEY (id_parada_recogida)
        REFERENCES Paradas(id_parada)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_asignaciones_parada_descenso
        FOREIGN KEY (id_parada_descenso)
        REFERENCES Paradas(id_parada)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- ============================================================
-- 13. VIAJES
-- ============================================================

CREATE TABLE Viajes (
    id_viaje INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_ruta INTEGER,
    id_chofer INTEGER,
    id_vehiculo INTEGER,
    fecha_viaje DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    estado VARCHAR(12) NOT NULL DEFAULT 'PROGRAMADO',

    CONSTRAINT chk_viajes_estado
        CHECK (estado IN (
            'PROGRAMADO',
            'ACTIVO',
            'FINALIZADO'
        )),

    CONSTRAINT fk_viajes_ruta
        FOREIGN KEY (id_ruta)
        REFERENCES Rutas(id_ruta)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_viajes_chofer
        FOREIGN KEY (id_chofer)
        REFERENCES Choferes(id_chofer)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_viajes_vehiculo
        FOREIGN KEY (id_vehiculo)
        REFERENCES Vehiculos(id_vehiculo)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- ============================================================
-- 14. ASISTENCIAS
-- ============================================================

CREATE TABLE Asistencias (
    id_asistencia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_viaje INTEGER NOT NULL,
    id_estudiante INTEGER NOT NULL,
    estado_abordaje VARCHAR(10) NOT NULL DEFAULT 'PENDIENTE',
    hora_abordaje TIMESTAMP,
    estado_descenso VARCHAR(20),
    hora_descenso TIMESTAMP,

    CONSTRAINT chk_asistencias_estado_abordaje
        CHECK (estado_abordaje IN (
            'PENDIENTE',
            'PRESENTE',
            'AUSENTE'
        )),

    CONSTRAINT fk_asistencias_viaje
        FOREIGN KEY (id_viaje)
        REFERENCES Viajes(id_viaje)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_asistencias_estudiante
        FOREIGN KEY (id_estudiante)
        REFERENCES Estudiantes(id_estudiante)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT uq_asistencia_viaje_estudiante
        UNIQUE (id_viaje, id_estudiante)
);

-- ============================================================
-- 15. UBICACIONES DEL BUS
-- ============================================================

CREATE TABLE Ubicaciones_Bus (
    id_ubicacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_viaje INTEGER NOT NULL,
    latitud DECIMAL(10,7) NOT NULL,
    longitud DECIMAL(10,7) NOT NULL,
    velocidad DECIMAL(8,2),
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ubicaciones_viaje
        FOREIGN KEY (id_viaje)
        REFERENCES Viajes(id_viaje)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ============================================================
-- 16. INCIDENCIAS
-- ============================================================

CREATE TABLE Incidencias (
    id_incidencia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_viaje INTEGER,
    id_ruta INTEGER NOT NULL,
    id_usuario_reporta INTEGER,
    titulo VARCHAR(40) NOT NULL,
    descripcion TEXT,
    latitud DECIMAL(10,7),
    longitud DECIMAL(10,7),
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(7) NOT NULL DEFAULT 'ABIERTA',

    CONSTRAINT chk_incidencias_estado
        CHECK (estado IN (
            'ABIERTA',
            'CERRADA'
        )),

    CONSTRAINT fk_incidencias_viaje
        FOREIGN KEY (id_viaje)
        REFERENCES Viajes(id_viaje)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_incidencias_ruta
        FOREIGN KEY (id_ruta)
        REFERENCES Rutas(id_ruta)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_incidencias_usuario
        FOREIGN KEY (id_usuario_reporta)
        REFERENCES Usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- ============================================================
-- 17. NOTIFICACIONES
-- ============================================================

CREATE TABLE Notificaciones (
    id_notificacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_incidencia INTEGER,
    id_asistencia INTEGER,
    tipo VARCHAR(12) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_envio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_notificaciones_tipo
        CHECK (tipo IN (
            'INCIDENTE',
            'ASISTENCIA',
            'INASISTENCIA',
            'OTRO'
        )),

    CONSTRAINT fk_notificaciones_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_notificaciones_incidencia
        FOREIGN KEY (id_incidencia)
        REFERENCES Incidencias(id_incidencia)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_notificaciones_asistencia
        FOREIGN KEY (id_asistencia)
        REFERENCES Asistencias(id_asistencia)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ============================================================
-- 18. PAGOS
-- ============================================================

CREATE TABLE Pagos (
    id_pago INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_estudiante INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,
    periodo_mes INTEGER,
    periodo_anio INTEGER,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(30),
    referencia_pago VARCHAR(100),
    foto_comprobante TEXT,
    estado VARCHAR(10) NOT NULL DEFAULT 'PENDIENTE',
    fecha_pago_limite DATE,
    fecha_verificacion DATE,
    verificado_por INTEGER,
    observaciones VARCHAR(255),

    CONSTRAINT chk_pagos_estado
        CHECK (estado IN (
            'PENDIENTE',
            'PAGADO',
            'CANCELADO'
        )),

    CONSTRAINT fk_pagos_estudiante
        FOREIGN KEY (id_estudiante)
        REFERENCES Estudiantes(id_estudiante)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_pagos_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES Servicios(id_servicio)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_pagos_verificador
        FOREIGN KEY (verificado_por)
        REFERENCES Usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT uq_pago_periodo
        UNIQUE (id_estudiante, id_servicio, periodo_mes, periodo_anio)
);

-- ============================================================
-- ACTUALIZACIÓN DE fecha_actualizacion
-- ============================================================

CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS trg_usuarios_fecha_actualizacion
ON Usuarios;

CREATE TRIGGER trg_usuarios_fecha_actualizacion
BEFORE UPDATE ON Usuarios
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

-- ============================================================
-- ÍNDICES
-- ============================================================

-- USUARIOS

CREATE INDEX IF NOT EXISTS idx_usuarios_rol
    ON Usuarios(rol);

CREATE INDEX IF NOT EXISTS idx_usuarios_correo_verificado
    ON Usuarios(correo_verificado);

CREATE INDEX IF NOT EXISTS idx_usuarios_nombre_apellido
    ON Usuarios(apellido, nombre);


-- PROVEEDORES

CREATE INDEX IF NOT EXISTS idx_proveedores_nombre_negocio
    ON Proveedores(nombre_negocio);


-- VALORACIONES

CREATE INDEX IF NOT EXISTS idx_valoraciones_proveedor
    ON Valoraciones(id_proveedor);

CREATE INDEX IF NOT EXISTS idx_valoraciones_proveedor_calificacion
    ON Valoraciones(id_proveedor, calificacion);


-- CHOFERES

CREATE INDEX IF NOT EXISTS idx_choferes_estado
    ON Choferes(estado);


-- COLEGIOS

CREATE INDEX IF NOT EXISTS idx_colegios_nombre
    ON Colegios(nombre);


-- ESTUDIANTES

CREATE INDEX IF NOT EXISTS idx_estudiantes_tutor
    ON Estudiantes(id_usuario_tutor);

CREATE INDEX IF NOT EXISTS idx_estudiantes_colegio
    ON Estudiantes(id_colegio);

CREATE INDEX IF NOT EXISTS idx_estudiantes_nombre_apellido
    ON Estudiantes(apellido, nombre);

CREATE INDEX IF NOT EXISTS idx_estudiantes_colegio_apellido
    ON Estudiantes(id_colegio, apellido);


-- VEHICULOS

CREATE INDEX IF NOT EXISTS idx_vehiculos_proveedor
    ON Vehiculos(id_proveedor);

CREATE INDEX IF NOT EXISTS idx_vehiculos_estado
    ON Vehiculos(estado);

CREATE INDEX IF NOT EXISTS idx_vehiculos_proveedor_estado
    ON Vehiculos(id_proveedor, estado);


-- SERVICIOS

CREATE INDEX IF NOT EXISTS idx_servicios_proveedor
    ON Servicios(id_proveedor);

CREATE INDEX IF NOT EXISTS idx_servicios_estado
    ON Servicios(estado);

CREATE INDEX IF NOT EXISTS idx_servicios_proveedor_estado
    ON Servicios(id_proveedor, estado);

CREATE INDEX IF NOT EXISTS idx_servicios_nombre
    ON Servicios(nombre);


-- RUTAS

CREATE INDEX IF NOT EXISTS idx_rutas_servicio
    ON Rutas(id_servicio);

CREATE INDEX IF NOT EXISTS idx_rutas_vehiculo
    ON Rutas(id_vehiculo);

CREATE INDEX IF NOT EXISTS idx_rutas_chofer
    ON Rutas(id_chofer);

CREATE INDEX IF NOT EXISTS idx_rutas_estado
    ON Rutas(estado);

CREATE INDEX IF NOT EXISTS idx_rutas_servicio_estado
    ON Rutas(id_servicio, estado);

-- ============================================================
-- 10. PARADAS
-- ============================================================

-- Buscar paradas por nombre
CREATE INDEX idx_paradas_nombre
    ON Paradas(nombre);


-- ============================================================
-- 11. RUTA_PARADA
-- ============================================================

-- Ya existe UNIQUE(id_ruta, orden_parada)

-- Buscar todas las paradas de una ruta
CREATE INDEX idx_ruta_parada_ruta
    ON Ruta_Parada(id_ruta);

-- Buscar rutas que utilizan una parada
CREATE INDEX idx_ruta_parada_parada
    ON Ruta_Parada(id_parada);

-- Buscar una parada concreta dentro de una ruta
CREATE INDEX idx_ruta_parada_ruta_parada
    ON Ruta_Parada(id_ruta, id_parada);


-- ============================================================
-- 12. ASIGNACIONES_RUTA
-- ============================================================

-- Buscar asignaciones de un estudiante
CREATE INDEX idx_asignaciones_estudiante
    ON Asignaciones_Ruta(id_estudiante);

-- Buscar estudiantes asignados a una ruta
CREATE INDEX idx_asignaciones_ruta
    ON Asignaciones_Ruta(id_ruta);

-- Buscar estudiantes de una ruta y parada de recogida
CREATE INDEX idx_asignaciones_ruta_recogida
    ON Asignaciones_Ruta(id_ruta, id_parada_recogida);

-- Buscar estudiantes de una ruta y parada de descenso
CREATE INDEX idx_asignaciones_ruta_descenso
    ON Asignaciones_Ruta(id_ruta, id_parada_descenso);

-- Buscar asignaciones por ruta y estudiante
CREATE INDEX idx_asignaciones_ruta_estudiante
    ON Asignaciones_Ruta(id_ruta, id_estudiante);


-- ============================================================
-- 13. VIAJES
-- ============================================================

-- Buscar viajes de una ruta
CREATE INDEX idx_viajes_ruta
    ON Viajes(id_ruta);

-- Buscar viajes de un chofer
CREATE INDEX idx_viajes_chofer
    ON Viajes(id_chofer);

-- Buscar viajes de un vehículo
CREATE INDEX idx_viajes_vehiculo
    ON Viajes(id_vehiculo);

-- Buscar viajes por fecha
CREATE INDEX idx_viajes_fecha
    ON Viajes(fecha_viaje);

-- Filtrar viajes por estado
CREATE INDEX idx_viajes_estado
    ON Viajes(estado);

-- Consulta típica: viajes de una ruta en una fecha
CREATE INDEX idx_viajes_ruta_fecha
    ON Viajes(id_ruta, fecha_viaje);

-- Consulta típica: viajes programados de una fecha
CREATE INDEX idx_viajes_fecha_estado
    ON Viajes(fecha_viaje, estado);


-- ============================================================
-- 14. ASISTENCIAS
-- ============================================================

-- Ya existe UNIQUE(id_viaje, id_estudiante)

-- Buscar asistencias de un estudiante
CREATE INDEX idx_asistencias_estudiante
    ON Asistencias(id_estudiante);

-- Buscar asistencias por estado
CREATE INDEX idx_asistencias_estado_abordaje
    ON Asistencias(estado_abordaje);

-- Buscar asistencias de un viaje por estado
CREATE INDEX idx_asistencias_viaje_estado
    ON Asistencias(id_viaje, estado_abordaje);

-- Buscar historial de asistencias de un estudiante
CREATE INDEX idx_asistencias_estudiante_viaje
    ON Asistencias(id_estudiante, id_viaje);


-- ============================================================
-- 15. UBICACIONES_BUS
-- ============================================================

-- Buscar todas las ubicaciones de un viaje
CREATE INDEX idx_ubicaciones_viaje
    ON Ubicaciones_Bus(id_viaje);

-- Muy importante para rastreo/historial GPS
CREATE INDEX idx_ubicaciones_viaje_fecha
    ON Ubicaciones_Bus(id_viaje, fecha_hora);

-- Consultas por fecha/hora
CREATE INDEX idx_ubicaciones_fecha_hora
    ON Ubicaciones_Bus(fecha_hora);


-- ============================================================
-- 16. INCIDENCIAS
-- ============================================================

-- Buscar incidencias de un viaje
CREATE INDEX idx_incidencias_viaje
    ON Incidencias(id_viaje);

-- Buscar incidencias de una ruta
CREATE INDEX idx_incidencias_ruta
    ON Incidencias(id_ruta);

-- Buscar incidencias reportadas por usuario
CREATE INDEX idx_incidencias_usuario
    ON Incidencias(id_usuario_reporta);

-- Filtrar incidencias por estado
CREATE INDEX idx_incidencias_estado
    ON Incidencias(estado);

-- Historial de incidencias ordenado por fecha
CREATE INDEX idx_incidencias_fecha
    ON Incidencias(fecha_hora);

-- Consulta típica: incidencias abiertas de una ruta
CREATE INDEX idx_incidencias_ruta_estado
    ON Incidencias(id_ruta, estado);

-- Consulta típica: incidencias de un viaje ordenadas por fecha
CREATE INDEX idx_incidencias_viaje_fecha
    ON Incidencias(id_viaje, fecha_hora);


-- ============================================================
-- 17. NOTIFICACIONES
-- ============================================================

-- Buscar notificaciones de un usuario
CREATE INDEX idx_notificaciones_usuario
    ON Notificaciones(id_usuario);

-- Notificaciones no leídas de un usuario
CREATE INDEX idx_notificaciones_usuario_leida
    ON Notificaciones(id_usuario, leida);

-- Ordenar notificaciones por fecha
CREATE INDEX idx_notificaciones_usuario_fecha
    ON Notificaciones(id_usuario, fecha_envio);

-- Filtrar notificaciones por tipo
CREATE INDEX idx_notificaciones_tipo
    ON Notificaciones(tipo);


-- ============================================================
-- 18. PAGOS
-- ============================================================

-- Ya existe UNIQUE(
--     id_estudiante,
--     id_servicio,
--     periodo_mes,
--     periodo_anio
-- )

-- Buscar pagos de un estudiante
CREATE INDEX idx_pagos_estudiante
    ON Pagos(id_estudiante);

-- Buscar pagos de un servicio
CREATE INDEX idx_pagos_servicio
    ON Pagos(id_servicio);

-- Filtrar pagos por estado
CREATE INDEX idx_pagos_estado
    ON Pagos(estado);

-- Buscar pagos pendientes
CREATE INDEX idx_pagos_estado_limite
    ON Pagos(estado, fecha_pago_limite);

-- Buscar pagos verificados por un usuario
CREATE INDEX idx_pagos_verificador
    ON Pagos(verificado_por);

-- Consultar pagos de un estudiante por período
CREATE INDEX idx_pagos_estudiante_periodo
    ON Pagos(
        id_estudiante,
        periodo_anio,
        periodo_mes
    );

-- Consultar pagos de un servicio por período
CREATE INDEX idx_pagos_servicio_periodo
    ON Pagos(
        id_servicio,
        periodo_anio,
        periodo_mes
    );

    -- ============================================================
-- 1. VALORACIONES
-- ============================================================

CREATE OR REPLACE FUNCTION obtener_valoraciones()
RETURNS SETOF valoraciones
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM valoraciones;
END;
$$;


CREATE OR REPLACE FUNCTION crear_valoracion(
    p_id_proveedor INTEGER,
    p_comentario TEXT,
    p_calificacion DOUBLE PRECISION
)
RETURNS valoraciones
LANGUAGE plpgsql
AS $$
DECLARE
    valoracion_creada valoraciones;
BEGIN
    INSERT INTO valoraciones (
        id_proveedor,
        comentario,
        calificacion
    )
    VALUES (
        p_id_proveedor,
        p_comentario,
        p_calificacion
    )
    RETURNING * INTO valoracion_creada;

    RETURN valoracion_creada;
END;
$$;


CREATE OR REPLACE FUNCTION buscar_valoracion_por_id(
    p_id_valoracion INTEGER
)
RETURNS SETOF valoraciones
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM valoraciones
    WHERE id_valoracion = p_id_valoracion;
END;
$$;


CREATE OR REPLACE FUNCTION editar_valoracion(
    p_id_valoracion INTEGER,
    p_id_proveedor INTEGER,
    p_comentario TEXT,
    p_calificacion DOUBLE PRECISION
)
RETURNS valoraciones
LANGUAGE plpgsql
AS $$
DECLARE
    valoracion_actualizada valoraciones;
BEGIN
    UPDATE valoraciones
    SET
        id_proveedor = p_id_proveedor,
        comentario = p_comentario,
        calificacion = p_calificacion
    WHERE id_valoracion = p_id_valoracion
    RETURNING * INTO valoracion_actualizada;

    RETURN valoracion_actualizada;
END;
$$;


CREATE OR REPLACE FUNCTION eliminar_valoracion(
    p_id_valoracion INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM valoraciones
    WHERE id_valoracion = p_id_valoracion;

    RETURN FOUND;
END;
$$;



-- ============================================================
-- 2. CHOFERES
-- ============================================================

CREATE OR REPLACE FUNCTION obtener_choferes()
RETURNS SETOF choferes
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM choferes;
END;
$$;


CREATE OR REPLACE FUNCTION crear_chofer(
    p_id_usuario INTEGER,
    p_telefono_contacto VARCHAR(20),
    p_estado VARCHAR(10)
)
RETURNS choferes
LANGUAGE plpgsql
AS $$
DECLARE
    chofer_creado choferes;
BEGIN
    INSERT INTO choferes (
        id_usuario,
        telefono_contacto,
        estado
    )
    VALUES (
        p_id_usuario,
        p_telefono_contacto,
        p_estado
    )
    RETURNING * INTO chofer_creado;

    RETURN chofer_creado;
END;
$$;


CREATE OR REPLACE FUNCTION buscar_chofer_por_id(
    p_id_chofer INTEGER
)
RETURNS SETOF choferes
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM choferes
    WHERE id_chofer = p_id_chofer;
END;
$$;


CREATE OR REPLACE FUNCTION editar_chofer(
    p_id_chofer INTEGER,
    p_id_usuario INTEGER,
    p_telefono_contacto VARCHAR(20),
    p_estado VARCHAR(10)
)
RETURNS choferes
LANGUAGE plpgsql
AS $$
DECLARE
    chofer_actualizado choferes;
BEGIN
    UPDATE choferes
    SET
        id_usuario = p_id_usuario,
        telefono_contacto = p_telefono_contacto,
        estado = p_estado
    WHERE id_chofer = p_id_chofer
    RETURNING * INTO chofer_actualizado;

    RETURN chofer_actualizado;
END;
$$;


CREATE OR REPLACE FUNCTION eliminar_chofer(
    p_id_chofer INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM choferes
    WHERE id_chofer = p_id_chofer;

    RETURN FOUND;
END;
$$;



-- ============================================================
-- 3. COLEGIOS
-- ============================================================

CREATE OR REPLACE FUNCTION obtener_colegios()
RETURNS SETOF colegios
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM colegios;
END;
$$;


CREATE OR REPLACE FUNCTION crear_colegio(
    p_nombre VARCHAR(200),
    p_direccion VARCHAR(255),
    p_telefono_contacto VARCHAR(20)
)
RETURNS colegios
LANGUAGE plpgsql
AS $$
DECLARE
    colegio_creado colegios;
BEGIN
    INSERT INTO colegios (
        nombre,
        direccion,
        telefono_contacto
    )
    VALUES (
        p_nombre,
        p_direccion,
        p_telefono_contacto
    )
    RETURNING * INTO colegio_creado;

    RETURN colegio_creado;
END;
$$;


CREATE OR REPLACE FUNCTION buscar_colegio_por_id(
    p_id_colegio INTEGER
)
RETURNS SETOF colegios
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM colegios
    WHERE id_colegio = p_id_colegio;
END;
$$;


CREATE OR REPLACE FUNCTION editar_colegio(
    p_id_colegio INTEGER,
    p_nombre VARCHAR(200),
    p_direccion VARCHAR(255),
    p_telefono_contacto VARCHAR(20)
)
RETURNS colegios
LANGUAGE plpgsql
AS $$
DECLARE
    colegio_actualizado colegios;
BEGIN
    UPDATE colegios
    SET
        nombre = p_nombre,
        direccion = p_direccion,
        telefono_contacto = p_telefono_contacto
    WHERE id_colegio = p_id_colegio
    RETURNING * INTO colegio_actualizado;

    RETURN colegio_actualizado;
END;
$$;


CREATE OR REPLACE FUNCTION eliminar_colegio(
    p_id_colegio INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM colegios
    WHERE id_colegio = p_id_colegio;

    RETURN FOUND;
END;
$$;



-- ============================================================
-- 4. ESTUDIANTES
-- ============================================================

CREATE OR REPLACE FUNCTION obtener_estudiantes()
RETURNS SETOF estudiantes
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM estudiantes;
END;
$$;


CREATE OR REPLACE FUNCTION crear_estudiante(
    p_id_usuario_tutor INTEGER,
    p_id_colegio INTEGER,
    p_nombre VARCHAR(100),
    p_apellido VARCHAR(100),
    p_fecha_nacimiento DATE,
    p_foto_estudiante TEXT,
    p_grado VARCHAR(50)
)
RETURNS estudiantes
LANGUAGE plpgsql
AS $$
DECLARE
    estudiante_creado estudiantes;
BEGIN
    INSERT INTO estudiantes (
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
    RETURNING * INTO estudiante_creado;

    RETURN estudiante_creado;
END;
$$;


CREATE OR REPLACE FUNCTION buscar_estudiante_por_id(
    p_id_estudiante INTEGER
)
RETURNS SETOF estudiantes
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM estudiantes
    WHERE id_estudiante = p_id_estudiante;
END;
$$;


CREATE OR REPLACE FUNCTION editar_estudiante(
    p_id_estudiante INTEGER,
    p_id_usuario_tutor INTEGER,
    p_id_colegio INTEGER,
    p_nombre VARCHAR(100),
    p_apellido VARCHAR(100),
    p_fecha_nacimiento DATE,
    p_foto_estudiante TEXT,
    p_grado VARCHAR(50)
)
RETURNS estudiantes
LANGUAGE plpgsql
AS $$
DECLARE
    estudiante_actualizado estudiantes;
BEGIN
    UPDATE estudiantes
    SET
        id_usuario_tutor = p_id_usuario_tutor,
        id_colegio = p_id_colegio,
        nombre = p_nombre,
        apellido = p_apellido,
        fecha_nacimiento = p_fecha_nacimiento,
        foto_estudiante = p_foto_estudiante,
        grado = p_grado
    WHERE id_estudiante = p_id_estudiante
    RETURNING * INTO estudiante_actualizado;

    RETURN estudiante_actualizado;
END;
$$;


CREATE OR REPLACE FUNCTION eliminar_estudiante(
    p_id_estudiante INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM estudiantes
    WHERE id_estudiante = p_id_estudiante;

    RETURN FOUND;
END;
$$;



-- ============================================================
-- 5. ASISTENCIAS
-- ============================================================

CREATE OR REPLACE FUNCTION obtener_asistencias()
RETURNS SETOF asistencias
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM asistencias;
END;
$$;


CREATE OR REPLACE FUNCTION crear_asistencia(
    p_id_viaje INTEGER,
    p_id_estudiante INTEGER,
    p_estado_abordaje VARCHAR(10),
    p_hora_abordaje TIMESTAMP,
    p_estado_descenso VARCHAR(20),
    p_hora_descenso TIMESTAMP
)
RETURNS asistencias
LANGUAGE plpgsql
AS $$
DECLARE
    asistencia_creada asistencias;
BEGIN
    INSERT INTO asistencias (
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
    RETURNING * INTO asistencia_creada;

    RETURN asistencia_creada;
END;
$$;


CREATE OR REPLACE FUNCTION buscar_asistencia_por_id(
    p_id_asistencia INTEGER
)
RETURNS SETOF asistencias
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM asistencias
    WHERE id_asistencia = p_id_asistencia;
END;
$$;


CREATE OR REPLACE FUNCTION editar_asistencia(
    p_id_asistencia INTEGER,
    p_id_viaje INTEGER,
    p_id_estudiante INTEGER,
    p_estado_abordaje VARCHAR(10),
    p_hora_abordaje TIMESTAMP,
    p_estado_descenso VARCHAR(20),
    p_hora_descenso TIMESTAMP
)
RETURNS asistencias
LANGUAGE plpgsql
AS $$
DECLARE
    asistencia_actualizada asistencias;
BEGIN
    UPDATE asistencias
    SET
        id_viaje = p_id_viaje,
        id_estudiante = p_id_estudiante,
        estado_abordaje = p_estado_abordaje,
        hora_abordaje = p_hora_abordaje,
        estado_descenso = p_estado_descenso,
        hora_descenso = p_hora_descenso
    WHERE id_asistencia = p_id_asistencia
    RETURNING * INTO asistencia_actualizada;

    RETURN asistencia_actualizada;
END;
$$;


CREATE OR REPLACE FUNCTION eliminar_asistencia(
    p_id_asistencia INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM asistencias
    WHERE id_asistencia = p_id_asistencia;

    RETURN FOUND;
END;
$$;



-- ============================================================
-- 6. PROVEEDORES
-- ============================================================

CREATE OR REPLACE FUNCTION obtener_proveedores()
RETURNS SETOF proveedores
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM proveedores;
END;
$$;


CREATE OR REPLACE FUNCTION crear_proveedor(
    p_id_usuario INTEGER,
    p_nombre_negocio VARCHAR(150),
    p_direccion VARCHAR(255),
    p_telefono_contacto VARCHAR(20)
)
RETURNS proveedores
LANGUAGE plpgsql
AS $$
DECLARE
    proveedor_creado proveedores;
BEGIN
    INSERT INTO proveedores (
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
    RETURNING * INTO proveedor_creado;

    RETURN proveedor_creado;
END;
$$;


CREATE OR REPLACE FUNCTION buscar_proveedor_por_id(
    p_id_proveedor INTEGER
)
RETURNS SETOF proveedores
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM proveedores
    WHERE id_proveedor = p_id_proveedor;
END;
$$;


CREATE OR REPLACE FUNCTION editar_proveedor(
    p_id_proveedor INTEGER,
    p_id_usuario INTEGER,
    p_nombre_negocio VARCHAR(150),
    p_direccion VARCHAR(255),
    p_telefono_contacto VARCHAR(20)
)
RETURNS proveedores
LANGUAGE plpgsql
AS $$
DECLARE
    proveedor_actualizado proveedores;
BEGIN
    UPDATE proveedores
    SET
        id_usuario = p_id_usuario,
        nombre_negocio = p_nombre_negocio,
        direccion = p_direccion,
        telefono_contacto = p_telefono_contacto
    WHERE id_proveedor = p_id_proveedor
    RETURNING * INTO proveedor_actualizado;

    RETURN proveedor_actualizado;
END;
$$;


CREATE OR REPLACE FUNCTION eliminar_proveedor(
    p_id_proveedor INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM proveedores
    WHERE id_proveedor = p_id_proveedor;

    RETURN FOUND;
END;
$$;



-- ============================================================
-- 7. RUTAS
-- ============================================================

CREATE OR REPLACE FUNCTION obtener_rutas()
RETURNS SETOF rutas
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM rutas;
END;
$$;


CREATE OR REPLACE FUNCTION crear_ruta(
    p_id_servicio INTEGER,
    p_id_vehiculo INTEGER,
    p_id_chofer INTEGER,
    p_nombre VARCHAR(150),
    p_hora_inicio_estimada TIME,
    p_hora_fin_estimada TIME,
    p_estado VARCHAR(10)
)
RETURNS rutas
LANGUAGE plpgsql
AS $$
DECLARE
    ruta_creada rutas;
BEGIN
    INSERT INTO rutas (
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
    RETURNING * INTO ruta_creada;

    RETURN ruta_creada;
END;
$$;


CREATE OR REPLACE FUNCTION buscar_ruta_por_id(
    p_id_ruta INTEGER
)
RETURNS SETOF rutas
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM rutas
    WHERE id_ruta = p_id_ruta;
END;
$$;


CREATE OR REPLACE FUNCTION editar_ruta(
    p_id_ruta INTEGER,
    p_id_servicio INTEGER,
    p_id_vehiculo INTEGER,
    p_id_chofer INTEGER,
    p_nombre VARCHAR(150),
    p_hora_inicio_estimada TIME,
    p_hora_fin_estimada TIME,
    p_estado VARCHAR(10)
)
RETURNS rutas
LANGUAGE plpgsql
AS $$
DECLARE
    ruta_actualizada rutas;
BEGIN
    UPDATE rutas
    SET
        id_servicio = p_id_servicio,
        id_vehiculo = p_id_vehiculo,
        id_chofer = p_id_chofer,
        nombre = p_nombre,
        hora_inicio_estimada = p_hora_inicio_estimada,
        hora_fin_estimada = p_hora_fin_estimada,
        estado = p_estado
    WHERE id_ruta = p_id_ruta
    RETURNING * INTO ruta_actualizada;

    RETURN ruta_actualizada;
END;
$$;


CREATE OR REPLACE FUNCTION eliminar_ruta(
    p_id_ruta INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM rutas
    WHERE id_ruta = p_id_ruta;

    RETURN FOUND;
END;
$$;



-- ============================================================
-- 8. INCIDENCIAS
-- ============================================================

CREATE OR REPLACE FUNCTION obtener_incidencias()
RETURNS SETOF incidencias
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM incidencias;
END;
$$;


CREATE OR REPLACE FUNCTION crear_incidencia(
    p_id_viaje INTEGER,
    p_id_ruta INTEGER,
    p_id_usuario_reporta INTEGER,
    p_titulo VARCHAR(40),
    p_descripcion TEXT,
    p_latitud DECIMAL(10,7),
    p_longitud DECIMAL(10,7),
    p_estado VARCHAR(7)
)
RETURNS incidencias
LANGUAGE plpgsql
AS $$
DECLARE
    incidencia_creada incidencias;
BEGIN
    INSERT INTO incidencias (
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
    RETURNING * INTO incidencia_creada;

    RETURN incidencia_creada;
END;
$$;


CREATE OR REPLACE FUNCTION buscar_incidencia_por_id(
    p_id_incidencia INTEGER
)
RETURNS SETOF incidencias
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM incidencias
    WHERE id_incidencia = p_id_incidencia;
END;
$$;


CREATE OR REPLACE FUNCTION editar_incidencia(
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
RETURNS incidencias
LANGUAGE plpgsql
AS $$
DECLARE
    incidencia_actualizada incidencias;
BEGIN
    UPDATE incidencias
    SET
        id_viaje = p_id_viaje,
        id_ruta = p_id_ruta,
        id_usuario_reporta = p_id_usuario_reporta,
        titulo = p_titulo,
        descripcion = p_descripcion,
        latitud = p_latitud,
        longitud = p_longitud,
        estado = p_estado
    WHERE id_incidencia = p_id_incidencia
    RETURNING * INTO incidencia_actualizada;

    RETURN incidencia_actualizada;
END;
$$;


CREATE OR REPLACE FUNCTION eliminar_incidencia(
    p_id_incidencia INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM incidencias
    WHERE id_incidencia = p_id_incidencia;

    RETURN FOUND;
END;
$$;