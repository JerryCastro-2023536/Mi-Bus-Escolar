export class DatabaseError extends Error {
    public statusCode: number;
    public error: any;

    constructor(message: string, error: any) {
        super(message);
        this.name = "DatabaseError";
        this.statusCode = 400;
        this.error = error;
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}