export class InternalError extends Error {
    public statusCode: number;
    public error: any;

    constructor(error: any) {
        super("Ocurrió un error interno en el servidor");
        this.name = "InternalError";
        this.statusCode = 500;
        this.error = error;
        Object.setPrototypeOf(this, InternalError.prototype);
    }
}