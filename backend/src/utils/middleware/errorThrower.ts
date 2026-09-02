import { DatabaseError } from "../../errors/database.error";
import { InternalError } from "../../errors/500.error";
import { NotFoundError } from "../../errors/notFound.error";
import { ValidationError } from "../../errors/validation.error";

/**
 * Centraliza el manejo de errores dentro de los servicios.
 * - Si el error ya es uno de nuestros errores controlados (NotFoundError,
 *   ValidationError, DatabaseError, InternalError), simplemente lo relanza
 *   para que el errorHandler lo procese.
 * - Si el error viene de la base de datos (tiene un "code" de Postgres),
 *   lo envuelve en un DatabaseError.
 * - En cualquier otro caso, lanza un InternalError genérico.
 */
export function errorThrower(error: any): never {
    if (
        error instanceof NotFoundError ||
        error instanceof ValidationError ||
        error instanceof DatabaseError ||
        error instanceof InternalError
    ) {
        throw error;
    }

    if (error?.code) {
        throw new DatabaseError("Ocurrió un error al interactuar con la base de datos.", error);
    }

    throw new InternalError();
}