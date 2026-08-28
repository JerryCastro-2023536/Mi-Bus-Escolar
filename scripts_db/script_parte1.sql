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