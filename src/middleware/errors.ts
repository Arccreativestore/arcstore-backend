

export class BadreqError extends Error{
 
    public name: string;
    public statusCode: number;
    public isOperational: boolean

    constructor(
        public message: string,
       
    )
    {
        super(message)
        this.name = 'BadreqError';
        this.statusCode = 400
        this.isOperational = true;
        Object.setPrototypeOf(this, BadreqError.prototype);
    }
}
export class ConflictError extends Error
{
    public name: string;
    public statusCode: number;
    public isOperational: boolean

    constructor(
        public message: string,
    )
    {
        super(message)
        this.name = 'ConflictError';
        this.statusCode = 409
        this.isOperational = true;
        Object.setPrototypeOf(this, BadreqError.prototype);
    }
}

export class NotFoundError extends Error {

    public name: string;
    public statusCode: number;
    public isOperational: boolean
    constructor(
        public message: string,
    )
    {
        super(message)
        this.name = 'NotFoundError';
        this.statusCode = 404
        this.isOperational = true;
        Object.setPrototypeOf(this, BadreqError.prototype);
    }
}

export class UnauthorizedError extends Error {

    public name: string;
    public statusCode: number;
    public isOperational: boolean
    constructor(
        public message: string,
    )
    {
        super(message)
        this.name = 'UnauthorizedError';
        this.statusCode = 401
        this.isOperational = true;
        Object.setPrototypeOf(this, BadreqError.prototype);
    }
}