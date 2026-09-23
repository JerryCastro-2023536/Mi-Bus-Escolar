# Mi-Bus-Escolar

Sistema de gestión para transporte escolar, con panel de administración, gestión de rutas y seguimiento operativo para proveedores, choferes, padres de familia y usuarios del sistema.

## Descripción

Mi-Bus-Escolar es una aplicación web orientada a la administración del transporte escolar. Permite gestionar usuarios, estudiantes, colegios, proveedores, vehículos, servicios, rutas, paradas, viajes, asistencias, incidencias, pagos y valoraciones, todo desde un frontend en Angular y un backend en Node.js/Express conectado a PostgreSQL.

El sistema está pensado para varios perfiles:

- Administradores: supervisan la operación general y gestionan datos maestros.
- Proveedores: administran sus vehículos, choferes, servicios y rutas.
- Choferes: consultan sus rutas, toman asistencias y registran incidencias.
- Usuarios/tutores: revisan información de sus estudiantes, viajes, pagos y notificaciones.

De manera general, el flujo del sistema combina autenticación con JWT, control por roles, CRUD sobre entidades principales y operaciones específicas de trazado y seguimiento de rutas. El objetivo principal es centralizar la administración del servicio de transporte escolar y ofrecer visibilidad operativa para cada tipo de usuario.

## Tecnologías utilizadas

- Frontend:
  - Angular 22
  - Angular SSR
  - RxJS
  - Bootstrap Icons
  - Leaflet y Leaflet Routing Machine para mapas y trazado
  - SweetAlert2 para alertas

- Backend:
  - Node.js
  - Express
  - TypeScript
  - PostgreSQL client (`pg`)
  - JWT para autenticación
  - `bcryptjs` para contraseñas
  - `zod` para validación de schemas
  - CORS y dotenv

- Base de datos:
  - PostgreSQL

- Herramientas y paquetes de desarrollo:
  - pnpm
  - tsx
  - TypeScript
  - Angular CLI
  - @types Node, Express, PG y JWT

## Arquitectura del proyecto

El repositorio está dividido en dos aplicaciones principales y una carpeta con scripts SQL para la base de datos.

```text
Mi-Bus-Escolar/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── enums/
│   │   ├── errors/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── server.ts
│   │   └── ...
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── environments/
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── main.server.ts
│   │   ├── server.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   └── tsconfig*.json
├── scripts_db/
│   ├── script_final.sql
│   ├── script_parte1.sql
│   ├── script_parte2.sql
│   ├── procedimientos.sql
│   ├── procedimientosLanding.sql
│   ├── procedimientosUserView.sql
│   └── procudures2.sql
├── LICENSE
├── README.md
└── .git/
```

### Organización del backend

El backend está construido con Express y TypeScript. La estructura se organiza en capas: 

- `config/`: conexión a la base de datos y variables de entorno.
- `controllers/`: manejan las peticiones HTTP y delegan la lógica técnica.
- `services/`: encapsulan la lógica de negocio y acceso a PostgreSQL.
- `routes/`: definen los endpoints públicos y protegidos de la API.
- `validators/`: validación con Zod para solicitudes de entrada.
- `models/`: interfaces y DTOs del dominio.
- `utils/`: helpers, middleware y generación/verificación de JWT.
- `errors/`: manejo de errores y excepciones.
- `enums/`: enumeraciones de roles y estados.

### Organización del frontend

El frontend usa Angular con rutas basadas en roles y componentes modulares. La aplicación organiza su lógica por:

- `app/components/`: vistas y componentes de cada módulo de negocio.
- `app/services/`: servicios para consumo de API, autenticación y operaciones específicas.
- `app/models/`: tipos e interfaces del cliente.
- `app/shared/`: rutas compartidas y recursos reutilizables.
- `app/config/`: configuración de roles y rutas del dashboard.
- `app/core/guards/`: protección de rutas por autenticación y permisos.

## Base de datos

La base de datos está implementada en PostgreSQL y el esquema principal se encuentra en `scripts_db/script_final.sql`.

Entre las tablas principales se incluyen:

- `Usuarios`
- `Proveedores`
- `Choferes`
- `Colegios`
- `Estudiantes`
- `Vehiculos`
- `Servicios`
- `Rutas`
- `Paradas`
- `Ruta_Parada`
- `Asignaciones_Ruta`
- `Viajes`
- `Asistencias`
- `Ubicaciones_Bus`
- `Incidencias`
- `Notificaciones`
- `Pagos`
- `Valoraciones`

El esquema define relaciones entre servicios, rutas, vehículos, choferes, estudiantes, pagos y notificaciones, así como índices para consultas frecuentes y restricciones de integridad.

La conexión al motor se realiza desde `backend/src/config/conexion.ts` usando `pg` con una `Pool`, soportando `DATABASE_URL` o variables de conexión separadas.

## Autenticación y permisos

El backend usa JWT y middleware de autenticación:

- `backend/src/utils/jwt.ts` genera y verifica tokens.
- `backend/src/utils/middleware/auth.middleware.ts` valida el `Authorization: Bearer ...`.
- `backend/src/utils/middleware/roleAuth.middleware.ts` restringe accesos según `userRol`.

Los roles definidos son:

- `ADMINISTRADOR`
- `PROVEEDOR`
- `CHOFER`
- `USUARIO`

El frontend también usa guards para redirigir a rutas según el rol autenticado.

## Variables de entorno

No existe un archivo `.env.example` en el repositorio. Para ejecutar el backend y el frontend correctamente, es necesario crear las variables de entorno necesarias conforme al código actual.

### Backend

Se usan variables como:

```env
APP_PORT=3000
PORT=3000
HOST=localhost
DB_PORT=5432
USER=postgres
PASSWORD=tu_password
DB=mi_bus_escolar
DB_SSL=false
DATABASE_URL=postgres://usuario:password@host:5432/mi_bus_escolar
ANGULAR_ORIGINS=http://localhost:4200
JWT_SECRET=tu_jwt_secret
JWT_EXPIRES_IN=1h
```

> No se deben incluir credenciales reales ni tokens reales en el README. Los valores anteriores son ejemplos de estructura, no secretos reales del proyecto.

### Frontend

El archivo `frontend/src/environments/enviroment.ts` contiene la configuración del cliente:

```ts
export const environment = {
  API_URL: "http://localhost:3000/api",
  CLOUD_NAME: "...",
  CLOUD_PRESET: "...",
  CLOUDINARY_API_KEY: "...",
  CLOUDINARY_API_SECRET: "..."
};
```

Ese archivo está presente en el proyecto y se usa para apuntar al backend y a servicios de Cloudinary. Sin embargo, en este documento no se incluyen los valores reales del proyecto.

## Endpoints principales del backend

La API principal se monta en `/api`, con una ruta base importada desde `backend/src/server.ts` y `backend/src/routes/apiRouter.ts`.

### Autenticación y landing

- `POST /api/login` — inicio de sesión.
- `POST /api/register` — registro de usuario.
- `GET /api/landing/proveedores` — proveedores públicos de la landing.
- `GET /api/landing/rutas` — rutas públicas de la landing.
- `GET /api/landing/servicios` — servicios públicos de la landing.
- `GET /api/landing/valoraciones` — valoraciones públicas.
- `GET /api/landing/valoracionesDetalle` — detalle de valoraciones de landing.

### Usuarios

- `GET /api/usuarios`
- `GET /api/usuarios/:id`
- `POST /api/usuarios`
- `PUT /api/usuarios/:id`
- `PUT /api/usuarios/password/:id`
- `DELETE /api/usuarios/:id`

### Proveedores, choferes, colegios, estudiantes, vehículos y servicios

- `GET /api/proveedores`, `POST /api/proveedores`, `PUT /api/proveedores/:id`, `DELETE /api/proveedores/:id`
- `GET /api/choferes`, `POST /api/choferes`, `PUT /api/choferes/:id`, `DELETE /api/choferes/:id`
- `GET /api/colegios`, `POST /api/colegios`, `PUT /api/colegios/:id`, `DELETE /api/colegios/:id`
- `GET /api/estudiantes`, `POST /api/estudiantes`, `PUT /api/estudiantes/:id`, `DELETE /api/estudiantes/:id`
- `GET /api/vehiculos`, `POST /api/vehiculos`, `PUT /api/vehiculos/:id`, `DELETE /api/vehiculos/:id`
- `GET /api/servicios`, `POST /api/servicios`, `PUT /api/servicios/:id`, `DELETE /api/servicios/:id`

Estos endpoints permiten administrar cantidades y relaciones clave para la operación escolar.

### Rutas, paradas y asignaciones

- `GET /api/rutas`, `POST /api/rutas`, `PUT /api/rutas/:id`, `DELETE /api/rutas/:id`
- `GET /api/paradas`, `POST /api/paradas`, `PUT /api/paradas/:id`, `DELETE /api/paradas/:id`
- `GET /api/ruta-parada`, `POST /api/ruta-parada`, `PUT /api/ruta-parada/:id`, `DELETE /api/ruta-parada/:id`
- `GET /api/asignaciones`, `POST /api/asignaciones`, `PUT /api/asignaciones/:id`, `DELETE /api/asignaciones/:id`

### Viajes, ubicaciones, asistencia y trazado

- `GET /api/viajes`, `GET /api/viajes/:id`
- `POST /api/viajes`, `PUT /api/viajes/:id`, `DELETE /api/viajes/:id`
- `POST /api/ubicaciones`, `POST /api/ubicaciones-bus`
- `GET /api/viajes/:idViaje/ubicacion-actual`
- `GET /api/rutas/:idRuta/paradas`
- `GET /api/viajes/hoy/:idChofer`
- `PATCH /api/viajes/:idViaje/iniciar`
- `PATCH /api/viajes/:idViaje/finalizar`
- `PATCH /api/viajes/:idViaje/abordaje/:idEstudiante`
- `PATCH /api/viajes/:idViaje/descenso/:idEstudiante`
- `PATCH /api/viajes/:idViaje/ausente/:idEstudiante`

Estos endpoints están orientados al seguimiento y monitoreo del recorrido del autobús escolar.

### Asistencias, incidencias, notificaciones y pagos

- `GET /api/asistencias`, `POST /api/asistencias`, `PUT /api/asistencias/:id`, `DELETE /api/asistencias/:id`
- `GET /api/incidencias`, `POST /api/incidencias`, `PUT /api/incidencias/:id`, `DELETE /api/incidencias/:id`
- `GET /api/notificaciones`, `POST /api/notificaciones`, `PUT /api/notificaciones/:id`, `DELETE /api/notificaciones/:id`
- `GET /api/pagos`, `POST /api/pagos`, `PUT /api/pagos/:id`, `DELETE /api/pagos/:id`
- `POST /api/pagos/registrar`

### Valoraciones y KPIs

- `GET /api/valoraciones`, `POST /api/valoraciones`, `PUT /api/valoraciones/:id`, `DELETE /api/valoraciones/:id`
- `POST /api/valoraciones/servicio/:idServicio`
- `GET /api/kpis/usuarios`, `GET /api/kpis/rutas`, `GET /api/kpis/servicios`, `GET /api/kpis/pagos`, `GET /api/kpis/vehiculos`, `GET /api/kpis/viajes`, entre otros KPIs del sistema

### Operaciones específicas de proveedor

El proyecto incluye un conjunto de rutas especializadas bajo `/api/proveedor-operaciones/:idUsuario`, como:

- gestión de servicios
- gestión de vehículos
- gestión de choferes
- gestión de rutas
- asignación de estudiantes a rutas
- consulta de incidencias y viajes
- consultas de valoraciones

## Funcionalidades principales implementadas

De acuerdo con el código actual, las funciones más relevantes del sistema son:

- Registro e inicio de sesión con JWT.
- Gestión por roles (`ADMINISTRADOR`, `PROVEEDOR`, `CHOFER`, `USUARIO`).
- CRUD de usuarios, colegios, estudiantes, proveedores, choferes, vehículos y servicios.
- Administración de rutas, paradas y relación ruta-parada.
- Asignación de estudiantes a rutas y paradas.
- Registro de viajes con estados programados/activos/finalizados.
- Trazado de rutas, ubicación GPS y seguimiento del autobús.
- Toma de asistencias y actualización de estados de abordaje/descenso.
- Registro y gestión de incidencias por parte del chofer o del sistema.
- Notificaciones por tipo (incidencia, asistencia, inasistencia, etc.).
- Gestión de pagos y comprobantes del servicio escolar.
- Valoraciones de servicios.
- Paneles KPI para métricas de operación.
- Landing page pública con información de proveedores, servicios y valoraciones.

## Requisitos necesarios

- Node.js compatible con Angular 22.
- pnpm instalado en el entorno.
- PostgreSQL disponible para la base de datos del proyecto.
- Acceso a un puerto disponible para el backend y un puerto disponible para Angular dev server.
- Git para clonar el repositorio.

## Instalación y ejecución

### 1. Clonar el proyecto

```bash
git clone <url-del-repositorio>
cd Mi-Bus-Escolar
```

### 2. Instalar dependencias del backend

```bash
cd backend
pnpm install
```

### 3. Instalar dependencias del frontend

```bash
cd ../frontend
pnpm install
```

### 4. Configurar variables de entorno

Crear el archivo `.env` en la carpeta `backend` con las variables requeridas según el esquema antes descrito.

### 5. Ejecutar el backend

```bash
cd backend
pnpm dev
```

El servidor usa el puerto configurado en `APP_PORT` o `PORT` y por defecto `3000`.

### 6. Ejecutar el frontend

```bash
cd frontend
pnpm start
```

La aplicación Angular se sirve normalmente en `http://localhost:4200`.

## Verificación y estado del proyecto

El proyecto incluye scripts de ejecución en `package.json`:

- Backend:
  - `pnpm dev`
  - `pnpm start`
  - `pnpm check`
- Frontend:
  - `pnpm start`
  - `pnpm build`
  - `pnpm test`
  - `pnpm watch`

En la configuración actual de `backend/package.json` no aparece una suite de pruebas definida; el comando `test` está configurado como un placeholder que devuelve error. Por tanto, la validación actual del repositorio está basada principalmente en la compilación de TypeScript y en la ejecución del backend/frontend en entorno local.

## Conclusión

Mi-Bus-Escolar es un sistema completo de administración del transporte escolar con un frontend basado en Angular y un backend en Express/TypeScript conectado a PostgreSQL. Su arquitectura está orientada a varios roles, ofrece seguimiento operativo de rutas y viajes, gestión documental y funcional de servicios y pagos, y está diseñado para cubrir tanto la administración operativa como la experiencia del usuario final.

La documentación de este README refleja únicamente lo que existe en el código, scripts SQL y configuración del proyecto actual.
