import { InternalError } from "../../errors/500.error";
import { AuthorizationError } from "../../errors/auth.error";
import { DatabaseError } from "../../errors/database.error";
import { InvalidToken } from "../../errors/expiredToken.error";
import { NotFoundError } from "../../errors/notFound.error";

const NOMBRES_LEGIBLES: Record<string, string> = {};

function extraerCampoDeDetail(detail: string | undefined): string | null {
    if (!detail) return null;
    const match = detail.match(/llave \(([^)]+)\)=/);
    return match ? match[1] : null;
}

function extraerValorDeDetail(detail: string | undefined): string | null {
    if (!detail) return null;
    const match = detail.match(/=\(([^)]+)\)/);
    return match ? match[1] : null;
}

function extraerTablaDeDetail(detail: string | undefined): string | null {
    if (!detail) return null;
    const match = detail.match(/no está presente en la tabla «([^»]+)»/);
    return match ? match[1] : null;
}

function extraerTablaReferenciadaDesde(detail: string | undefined): string | null {
    if (!detail) return null;
    const match = detail.match(/todavía es referenciada desde la tabla «([^»]+)»/);
    return match ? match[1] : null;
}

export function errorThrower(error: any): never {
    // Si ya es un error formateado por nosotros, lo dejamos pasar
    if (
        error.statusCode ||
        error instanceof DatabaseError ||
        error instanceof InternalError ||
        error instanceof NotFoundError ||
        error instanceof InvalidToken ||
        error instanceof AuthorizationError
    ) {
        throw error;
    }

    if (typeof error === "object" && error !== null && "code" in error) {
        const campo = extraerCampoDeDetail(error.detail);
        const nombreLegible = campo ? (NOMBRES_LEGIBLES[campo] ?? campo) : "el valor";
        const nombreCampo = campo ?? "general"; // Fallback si no se detecta el campo

        // 23505: Unique violation (Registro duplicado)
        if (error.code === "23505") {
            throw new DatabaseError(
                "Error en la base de datos",
                [{
                    campo: nombreCampo,
                    mensaje: `El ${nombreLegible} que ingresó ya existe`
                }]
            );
        }

        // 23503: Foreign key violation (Llaves foráneas)
        if (error.code === "23503") {
            const valor = extraerValorDeDetail(error.detail);

            const tablaNoExiste = extraerTablaDeDetail(error.detail);
            if (campo && valor && tablaNoExiste) {
                throw new DatabaseError(
                    "Restricción de datos",
                    [{
                        campo: nombreCampo,
                        mensaje: `El ${nombreLegible} con ingresado no existe.`
                    }]
                );
            }

            const tablaReferenciada = extraerTablaReferenciadaDesde(error.detail);
            if (campo && valor && tablaReferenciada) {
                throw new DatabaseError(
                    "Restricción de datos",
                    [{
                        campo: nombreCampo,
                        mensaje: `No se puede eliminar: el ${nombreLegible} todavía tiene registros asociados.`
                    }]
                );
            }

            if (campo && valor) {
                throw new DatabaseError(
                    "Restricción de datos",
                    [{
                        campo: nombreCampo,
                        mensaje: `No se puede completar la operación: el campo "${nombreLegible}" está relacionado con otro registro y no existe o tiene datos asociados.`
                    }]
                );
            }

            throw new DatabaseError(
                "Restricción de datos",
                [{
                    campo: "general",
                    mensaje: "No se puede completar la operación porque el registro tiene datos asociados o la referencia no existe."
                }]
            );
        }

        // 23514: Check violation (Reglas de validación)
        if (error.code === "23514") {
            throw new DatabaseError(
                "Error de validación de datos",
                [{
                    campo: nombreCampo,
                    mensaje: `El valor ${nombreLegible} ingresado no cumple con las reglas permitidas para este campo.`
                }]
            );
        }

        // 23502: Not null violation (Datos incompletos / obligatorios)
        if (error.code === "23502") {
            const campoFaltante = error.column ?? "requerido";
            throw new DatabaseError(
                "Error de validación de datos",
                [{
                    campo: campoFaltante,
                    mensaje: `El campo '${campoFaltante}' es obligatorio`
                }]
            );
        }
    }

    throw new InternalError(error);
}