import { InternalError } from "../../errors/500.error";
import { AuthorizationError } from "../../errors/auth.error";
import { DatabaseError } from "../../errors/database.error";
import { InvalidToken } from "../../errors/expiredToken.error";
import { NotFoundError } from "../../errors/notFound.error";

const NOMBRES_LEGIBLES: Record<string, string> = {

};

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

        if (error.code === "23505"){
            throw new DatabaseError(
                "Error en la base de datos",
                `El ${nombreLegible} que ingresó ya existe`
            );
        }

        if (error.code === "23503") {
            console.log("errorDetail:", error.detail);
            
            const campo = extraerCampoDeDetail(error.detail);
            const valor = extraerValorDeDetail(error.detail);
            const nombreLegible = campo ? (NOMBRES_LEGIBLES[campo] ?? campo) : "el valor";

            const tablaNoExiste = extraerTablaDeDetail(error.detail);
            if (campo && valor && tablaNoExiste) {
                throw new DatabaseError(
                    "Restricción de datos",
                    `El ${nombreLegible} con valor "${valor}" no existe en la tabla "${tablaNoExiste}".`
                );
            }

            const tablaReferenciada = extraerTablaReferenciadaDesde(error.detail);
            if (campo && valor && tablaReferenciada) {
                throw new DatabaseError(
                    "Restricción de datos",
                    `No se puede eliminar: el ${nombreLegible} con valor "${valor}" todavía tiene registros asociados en la tabla "${tablaReferenciada}".`
                );
            }

            if (campo && valor) {
                throw new DatabaseError(
                    "Restricción de datos",
                    `No se puede completar la operación: el campo "${nombreLegible}" con valor "${valor}" está relacionado con otro registro y no existe o tiene datos asociados.`
                );
            }

            throw new DatabaseError(
                "Restricción de datos",
                "No se puede completar la operación porque el registro tiene datos asociados o la referencia no existe."
            );
        }

        if (error.code === "23514"){
            throw new DatabaseError(
                "Restricción de datos",
                `El valor ${nombreLegible} ingresado no cumple con las reglas permitidas para este campo.`
            );
        }

        if (error.code === "23502"){
            throw new DatabaseError(
                "Datos incompletos",
                `El campo "${error.column ?? "requerido"}" no puede estar vacío.`
            );
        }
    }

    throw new InternalError(error);
}