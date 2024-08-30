

class BadreqError extends Error{

    constructor(message)
    {
        super(message)
        this.name = 'BadreqError';
        this.statusCode = 400
        this.isOperational = true;
    }
}
class ConflictError extends Error
{
    constructor(message)
    {
        super(message)
        this.statusCode = 409
        this.isOperational = true;
        this.name = 'ConflictError'
    }
}

class NotFoundError extends Error {
    constructor(message)
    {
        super(message)
        this.statusCode = 404
        this.isOperational = true;
        this.name = 'NotFoundError'
    }
}

class UnauthorizedError extends Error {
    constructor(message)
    {
        super(message)
        this.statusCode = 401
        this.isOperational = true;
        this.name = 'UnauthorizedError'
    } 
}
module.exports = {BadreqError, ConflictError,NotFoundError, UnauthorizedError}