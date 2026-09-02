export class ValidationError extends Error {
    public statusCode: number;
    public errors: any[];

    constructor(message: string, errors: any[]) {
        super(message);
        this.name = "ValidationError";
        this.statusCode = 400;
        this.errors = errors;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}