export class InvalidToken extends Error {
    public statusCode: number;
    
    constructor(message: string) {
        super(message);
        this.name = "InvalidToken";
        this.statusCode = 403;
        Object.setPrototypeOf(this, InvalidToken.prototype);
    }
}