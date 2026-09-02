export class InternalError extends Error {
    public statusCode: number;

    constructor() {
        super("Ocurrió un error interno en el servidor");
        this.name = "InternalError";
        this.statusCode = 500;
        Object.setPrototypeOf(this, InternalError.prototype);
    }
}