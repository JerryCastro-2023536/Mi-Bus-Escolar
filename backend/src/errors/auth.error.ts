export class AuthorizationError extends Error {
    public statusCode: number;
    
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 401;
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}