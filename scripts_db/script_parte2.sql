-- ============================================================
-- 9. RUTAS
-- ============================================================

CREATE TABLE Rutas (
    id_ruta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_servicio INTEGER NOT NULL,
    id_vehiculo INTEGER,
    id_chofer INTEGER,
    nombre VARCHAR(150) NOT NULL,
    hora_inicio_estimada TIME,
    hora_fin_estimada TIME,
    estado VARCHAR(10) NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT chk_rutas_estado
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
-- 1. PAGOS
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