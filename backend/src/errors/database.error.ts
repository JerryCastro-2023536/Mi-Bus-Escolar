export class DatabaseError extends Error {
    public statusCode: number;
    public errors: any[];

    constructor(message: string, errors: any[]) {
        super(message);
        this.name = "DatabaseError";
        this.statusCode = 400;
        this.errors = errors;
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}