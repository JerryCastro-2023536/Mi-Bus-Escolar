export class JsonError extends Error {
    public statusCode: number;
    
    constructor(message: string) {
        super(message);
        this.name = "JsonError";
        this.statusCode = 400;
        Object.setPrototypeOf(this, JsonError.prototype);
    }
}