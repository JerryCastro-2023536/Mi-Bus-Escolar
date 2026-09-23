import { Request, Response, NextFunction } from "express";
import * as service from "../services/proveedorOperaciones.service";
import { ProveedorRutaPayload } from "../models/proveedorRutaPayload";

function ok(
    res: Response,
    message: string,
    data: unknown,
    status: number = 200,
) {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
}

function id(value: string | string[]): number {
    const valor = Array.isArray(value) ? value[0] : value;
    return Number(valor);
}

// ============================================================
// SERVICIOS
// ============================================================

export async function getServicios(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Servicios cargados",
            await service.listarServiciosProveedor(id(req.params.idUsuario)),
        );
    } catch (error) {
        next(error);
    }
}

// ============================================================
// VEHÍCULOS
// ============================================================

export async function getVehiculos(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Vehículos cargados",
            await service.listarVehiculosProveedor(id(req.params.idUsuario)),
        );
    } catch (error) {
        next(error);
    }
}

// ============================================================
// CHOFERES
// ============================================================

export async function getChoferes(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Choferes cargados",
            await service.listarChoferesProveedor(id(req.params.idUsuario)),
        );
    } catch (error) {
        next(error);
    }
}

export async function getUsuariosChofer(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Usuarios encontrados",
            await service.buscarUsuariosParaChofer(
                id(req.params.idUsuario),
                String(req.query.q ?? ""),
            ),
        );
    } catch (error) {
        next(error);
    }
}

export async function postChofer(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Chofer creado correctamente",
            await service.crearChoferProveedor(
                id(req.params.idUsuario),
                Number(req.body.id_usuario),
            ),
            201,
        );
    } catch (error) {
        next(error);
    }
}

export async function putChofer(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Chofer actualizado correctamente",
            await service.actualizarChoferProveedor(
                id(req.params.idUsuario),
                id(req.params.idChofer),
                String(req.body.telefono_contacto ?? "").trim(),
                String(req.body.estado ?? "ACTIVO").toUpperCase(),
            ),
        );
    } catch (error) {
        next(error);
    }
}

export async function deleteChofer(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Chofer eliminado correctamente",
            await service.eliminarChoferProveedor(
                id(req.params.idUsuario),
                id(req.params.idChofer),
            ),
        );
    } catch (error) {
        next(error);
    }
}

export async function deleteRutasChofer(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Rutas desasignadas correctamente",
            await service.desasignarRutasChofer(
                id(req.params.idUsuario),
                id(req.params.idChofer),
                req.body.rutas,
            ),
        );
    } catch (error) {
        next(error);
    }
}

// ============================================================
// RUTAS
// ============================================================

export async function getRutas(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Rutas cargadas",
            await service.listarRutasProveedor(id(req.params.idUsuario)),
        );
    } catch (error) {
        next(error);
    }
}

export async function postRuta(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const payload: ProveedorRutaPayload = {
            id_servicio: Number(req.body.id_servicio),
            nombre: String(req.body.nombre ?? "").trim(),
            hora_inicio_estimada: req.body.hora_inicio_estimada || null,
            hora_fin_estimada: req.body.hora_fin_estimada || null,
            estado: req.body.estado ?? "ACTIVO",
        };

        return ok(
            res,
            "Ruta creada correctamente",
            await service.crearRutaProveedor(
                id(req.params.idUsuario),
                payload,
            ),
            201,
        );
    } catch (error) {
        next(error);
    }
}

export async function putRuta(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const payload: ProveedorRutaPayload = {
            id_servicio: Number(req.body.id_servicio),
            nombre: String(req.body.nombre ?? "").trim(),
            hora_inicio_estimada: req.body.hora_inicio_estimada || null,
            hora_fin_estimada: req.body.hora_fin_estimada || null,
            estado: req.body.estado ?? "ACTIVO",
        };

        return ok(
            res,
            "Ruta actualizada correctamente",
            await service.actualizarRutaProveedor(
                id(req.params.idUsuario),
                id(req.params.idRuta),
                payload,
            ),
        );
    } catch (error) {
        next(error);
    }
}

export async function putRutaChofer(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const idChofer: number | null =
            req.body.id_chofer == null
                ? null
                : Number(req.body.id_chofer);

        return ok(
            res,
            idChofer === null
                ? "Chofer desasignado correctamente"
                : "Chofer asignado correctamente",
            await service.asignarChoferRuta(
                id(req.params.idUsuario),
                id(req.params.idRuta),
                idChofer,
            ),
        );
    } catch (error) {
        next(error);
    }
}

export async function putRutaVehiculo(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const idVehiculo: number | null =
            req.body.id_vehiculo == null
                ? null
                : Number(req.body.id_vehiculo);

        return ok(
            res,
            idVehiculo === null
                ? "Vehículo desasignado correctamente"
                : "Vehículo asignado correctamente",
            await service.asignarVehiculoRuta(
                id(req.params.idUsuario),
                id(req.params.idRuta),
                idVehiculo,
            ),
        );
    } catch (error) {
        next(error);
    }
}

export async function deleteRuta(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Ruta eliminada correctamente",
            await service.eliminarRutaProveedor(
                id(req.params.idUsuario),
                id(req.params.idRuta),
            ),
        );
    } catch (error) {
        next(error);
    }
}

// ============================================================
// ASIGNACIÓN DE ESTUDIANTES
// ============================================================

export async function getAsignaciones(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Estudiantes cargados",
            await service.listarAsignaciones(
                id(req.params.idUsuario),
                id(req.params.idRuta),
            ),
        );
    } catch (error) {
        next(error);
    }
}

export async function getEstudiantesBuscar(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Estudiantes encontrados",
            await service.buscarEstudiantes(
                id(req.params.idUsuario),
                id(req.params.idRuta),
                String(req.query.q ?? ""),
            ),
        );
    } catch (error) {
        next(error);
    }
}

export async function postEstudiante(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Estudiante asignado correctamente",
            await service.asignarEstudiante(
                id(req.params.idUsuario),
                id(req.params.idRuta),
                Number(req.body.id_estudiante),
            ),
            201,
        );
    } catch (error) {
        next(error);
    }
}

export async function deleteEstudiante(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Estudiante retirado correctamente",
            await service.retirarEstudiante(
                id(req.params.idUsuario),
                id(req.params.idRuta),
                id(req.params.idAsignacion),
            ),
        );
    } catch (error) {
        next(error);
    }
}

// ============================================================
// INCIDENCIAS
// ============================================================

export async function getIncidencias(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Incidencias cargadas",
            await service.listarIncidenciasProveedor(id(req.params.idUsuario)),
        );
    } catch (error) {
        next(error);
    }
}

// ============================================================
// VIAJES
// ============================================================

export async function getViajes(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Viajes cargados",
            await service.listarViajesProveedor(id(req.params.idUsuario)),
        );
    } catch (error) {
        next(error);
    }
}

// ============================================================
// VALORACIONES
// ============================================================

export async function getValoraciones(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        return ok(
            res,
            "Valoraciones del servicio cargadas",
            await service.listarValoracionesProveedor(
                id(req.params.idUsuario),
                id(req.params.idServicio),
            ),
        );
    } catch (error) {
        next(error);
    }
}
