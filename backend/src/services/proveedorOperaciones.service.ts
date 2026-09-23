import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { ValidationError } from "../errors/validation.error";
import { errorThrower } from "../utils/middleware/errorThrower";
import { ProveedorRutaPayload } from "../models/proveedorRutaPayload";

async function proveedorExiste(idUsuario: number): Promise<number> {
    const r = await pool.query(
        "SELECT sp_proveedor_id_por_usuario($1) AS id_proveedor",
        [idUsuario],
    );
    const idProveedor = r.rows[0]?.id_proveedor;
    if (!idProveedor)
        throw new NotFoundError("No se encontró un proveedor asociado al usuario.");
    return Number(idProveedor);
}

function idPositivo(value: unknown, campo: string): number {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0)
        throw new ValidationError("Dato inválido", [
            { campo, mensaje: `${campo} debe ser un entero positivo.` },
        ]);
    return n;
}

export async function listarServiciosProveedor(idUsuario: number) {
    try {
        await proveedorExiste(idUsuario);
        return (
            await pool.query("SELECT * FROM sp_proveedor_servicios_listar($1)", [
                idUsuario,
            ])
        ).rows;
    } catch (e) {
        errorThrower(e);
    }
}

export async function listarVehiculosProveedor(idUsuario: number) {
    try {
        await proveedorExiste(idUsuario);
        return (
            await pool.query("SELECT * FROM sp_vehiculos_por_proveedor_usuario($1)", [
                idUsuario,
            ])
        ).rows;
    } catch (e) {
        errorThrower(e);
    }
}

export async function listarChoferesProveedor(idUsuario: number) {
    try {
        await proveedorExiste(idUsuario);
        return (
            await pool.query("SELECT * FROM sp_proveedor_choferes_listar($1)", [
                idUsuario,
            ])
        ).rows;
    } catch (e) {
        errorThrower(e);
    }
}

export async function buscarUsuariosParaChofer(idUsuario: number, q: string) {
    try {
        await proveedorExiste(idUsuario);
        const termino = String(q ?? "").trim();
        if (termino.length < 2) return [];
        return (
            await pool.query(
                "SELECT * FROM sp_proveedor_usuarios_chofer_buscar($1, $2)",
                [idUsuario, termino],
            )
        ).rows;
    } catch (e) {
        errorThrower(e);
    }
}

export async function crearChoferProveedor(
    idUsuarioProveedor: number,
    idUsuarioChofer: number,
) {
    try {
        idPositivo(idUsuarioChofer, "id_usuario");
        await proveedorExiste(idUsuarioProveedor);
        const r = await pool.query(
            "SELECT * FROM sp_proveedor_chofer_crear($1, $2)",
            [idUsuarioProveedor, idUsuarioChofer],
        );
        if (!r.rows[0])
            throw new ValidationError("No se pudo crear el chofer", [
                {
                    campo: "usuario",
                    mensaje: "El usuario no está disponible para convertirse en chofer.",
                },
            ]);
        return r.rows[0];
    } catch (e) {
        errorThrower(e);
    }
}

export async function actualizarChoferProveedor(
    idUsuarioProveedor: number,
    idChofer: number,
    telefono: string,
    estado: string,
) {
    try {
        idPositivo(idChofer, "id_chofer");
        await proveedorExiste(idUsuarioProveedor);
        const r = await pool.query(
            "SELECT * FROM sp_proveedor_chofer_actualizar($1, $2, $3, $4)",
            [
                idUsuarioProveedor,
                idChofer,
                telefono?.trim(),
                String(estado).toUpperCase(),
            ],
        );
        if (!r.rows[0])
            throw new NotFoundError(
                "El chofer no existe o no pertenece a este proveedor.",
            );
        return r.rows[0];
    } catch (e) {
        errorThrower(e);
    }
}

export async function eliminarChoferProveedor(
    idUsuarioProveedor: number,
    idChofer: number,
) {
    try {
        await proveedorExiste(idUsuarioProveedor);
        const r = await pool.query(
            "SELECT sp_proveedor_chofer_eliminar($1, $2) AS eliminado",
            [idUsuarioProveedor, idChofer],
        );
        if (!r.rows[0]?.eliminado)
            throw new NotFoundError(
                "El chofer no existe o no pertenece a este proveedor.",
            );
        return true;
    } catch (e) {
        errorThrower(e);
    }
}

export async function desasignarRutasChofer(
    idUsuarioProveedor: number,
    idChofer: number,
    rutas: number[],
) {
    try {
        await proveedorExiste(idUsuarioProveedor);
        if (!Array.isArray(rutas) || rutas.length === 0)
            throw new ValidationError("Rutas inválidas", [
                { campo: "rutas", mensaje: "Selecciona al menos una ruta." },
            ]);
        const ids = rutas.map((r) => idPositivo(r, "id_ruta"));
        const r = await pool.query(
            "SELECT sp_proveedor_chofer_desasignar_rutas($1, $2, $3::INTEGER[]) AS eliminado",
            [idUsuarioProveedor, idChofer, ids],
        );
        return Boolean(r.rows[0]?.eliminado);
    } catch (e) {
        errorThrower(e);
    }
}

export async function listarRutasProveedor(idUsuario: number) {
    try {
        await proveedorExiste(idUsuario);
        return (
            await pool.query("SELECT * FROM sp_proveedor_rutas_listar($1)", [
                idUsuario,
            ])
        ).rows;
    } catch (e) {
        errorThrower(e);
    }
}

export async function crearRutaProveedor(
    idUsuario: number,
    data: ProveedorRutaPayload,
) {
    try {
        const idServicio = idPositivo(data.id_servicio, "id_servicio");
        const nombre = String(data.nombre ?? "").trim();
        if (!nombre)
            throw new ValidationError("Ruta inválida", [
                { campo: "nombre", mensaje: "El nombre de la ruta es obligatorio." },
            ]);
        await proveedorExiste(idUsuario);
        const r = await pool.query(
            "SELECT * FROM sp_proveedor_ruta_crear($1, $2, $3, $4, $5)",
            [
                idUsuario,
                idServicio,
                nombre,
                data.hora_inicio_estimada || null,
                data.hora_fin_estimada || null,
            ],
        );
        return r.rows[0];
    } catch (e) {
        errorThrower(e);
    }
}

export async function actualizarRutaProveedor(
    idUsuario: number,
    idRuta: number,
    data: ProveedorRutaPayload,
) {
    try {
        const idServicio = idPositivo(data.id_servicio, "id_servicio");
        const nombre = String(data.nombre ?? "").trim();
        if (!nombre)
            throw new ValidationError("Ruta inválida", [
                { campo: "nombre", mensaje: "El nombre de la ruta es obligatorio." },
            ]);
        await proveedorExiste(idUsuario);
        const r = await pool.query(
            "SELECT * FROM sp_proveedor_ruta_actualizar($1, $2, $3, $4, $5, $6, $7)",
            [
                idUsuario,
                idRuta,
                idServicio,
                nombre,
                data.hora_inicio_estimada || null,
                data.hora_fin_estimada || null,
                data.estado || "ACTIVO",
            ],
        );
        if (!r.rows[0])
            throw new NotFoundError("La ruta no existe o no pertenece al proveedor.");
        return r.rows[0];
    } catch (e) {
        errorThrower(e);
    }
}

export async function asignarChoferRuta(
    idUsuario: number,
    idRuta: number,
    idChofer: number | null,
) {
    try {
        await proveedorExiste(idUsuario);
        return (
            await pool.query(
                "SELECT * FROM sp_proveedor_ruta_asignar_chofer($1, $2, $3)",
                [idUsuario, idRuta, idChofer],
            )
        ).rows[0];
    } catch (e) {
        errorThrower(e);
    }
}

export async function asignarVehiculoRuta(
    idUsuario: number,
    idRuta: number,
    idVehiculo: number | null,
) {
    try {
        await proveedorExiste(idUsuario);
        return (
            await pool.query(
                "SELECT * FROM sp_proveedor_ruta_asignar_vehiculo($1, $2, $3)",
                [idUsuario, idRuta, idVehiculo],
            )
        ).rows[0];
    } catch (e) {
        errorThrower(e);
    }
}

export async function eliminarRutaProveedor(idUsuario: number, idRuta: number) {
    try {
        await proveedorExiste(idUsuario);
        const r = await pool.query(
            "SELECT sp_proveedor_ruta_eliminar($1, $2) AS eliminado",
            [idUsuario, idRuta],
        );
        if (!r.rows[0]?.eliminado)
            throw new NotFoundError("La ruta no existe o no pertenece al proveedor.");
        return true;
    } catch (e) {
        errorThrower(e);
    }
}

export async function listarAsignaciones(idUsuario: number, idRuta: number) {
    try {
        await proveedorExiste(idUsuario);
        return (
            await pool.query(
                "SELECT * FROM sp_proveedor_asignaciones_ruta_listar($1, $2)",
                [idUsuario, idRuta],
            )
        ).rows;
    } catch (e) {
        errorThrower(e);
    }
}

export async function buscarEstudiantes(
    idUsuario: number,
    idRuta: number,
    q: string,
) {
    try {
        await proveedorExiste(idUsuario);
        const termino = String(q ?? "").trim();
        if (termino.length < 2) return [];
        return (
            await pool.query(
                "SELECT * FROM sp_proveedor_estudiantes_ruta_buscar($1, $2, $3)",
                [idUsuario, idRuta, termino],
            )
        ).rows;
    } catch (e) {
        errorThrower(e);
    }
}

export async function asignarEstudiante(
    idUsuario: number,
    idRuta: number,
    idEstudiante: number,
) {
    try {
        await proveedorExiste(idUsuario);
        const r = await pool.query(
            "SELECT * FROM sp_proveedor_asignar_estudiante_ruta($1, $2, $3)",
            [idUsuario, idRuta, idEstudiante],
        );
        return r.rows[0];
    } catch (e) {
        errorThrower(e);
    }
}

export async function retirarEstudiante(
    idUsuario: number,
    idRuta: number,
    idAsignacion: number,
) {
    try {
        await proveedorExiste(idUsuario);
        const r = await pool.query(
            "SELECT sp_proveedor_retirar_estudiante_ruta($1, $2, $3) AS eliminado",
            [idUsuario, idRuta, idAsignacion],
        );
        if (!r.rows[0]?.eliminado)
            throw new NotFoundError(
                "La asignación no existe o no pertenece al proveedor.",
            );
        return true;
    } catch (e) {
        errorThrower(e);
    }
}

export async function listarIncidenciasProveedor(idUsuario: number) {
    try {
        await proveedorExiste(idUsuario);
        return (
            await pool.query("SELECT * FROM sp_proveedor_incidencias_listar($1)", [
                idUsuario,
            ])
        ).rows;
    } catch (e) {
        errorThrower(e);
    }
}
export async function listarViajesProveedor(idUsuario: number) {
    try {
        await proveedorExiste(idUsuario);
        return (
            await pool.query("SELECT * FROM sp_proveedor_viajes_listar($1)", [
                idUsuario,
            ])
        ).rows;
    } catch (e) {
        errorThrower(e);
    }
}
export async function listarValoracionesProveedor(idUsuario: number, idServicio: number) {
    try {
        await proveedorExiste(idUsuario);
        return (
            await pool.query(
                "SELECT * FROM sp_proveedor_valoraciones_listar($1, $2)",
                [idUsuario, idServicio],
            )
        ).rows;
    } catch (e) {
        errorThrower(e);
    }
}
