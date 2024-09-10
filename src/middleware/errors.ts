import { Request, RequestHandler, ErrorRequestHandler, Response, NextFunction } from "express";
import { logger } from "../config/logger";
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

export const ErrorMiddleware: ErrorRequestHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (
      err instanceof BadreqError ||
      err instanceof ConflictError ||
      err instanceof NotFoundError ||
      err instanceof UnauthorizedError
    ) {
        // user errors
      const statusCode = err.statusCode || 500;
      const message = err.isOperational ? err.message : "Internal Server Error";
      return res.status(statusCode).json({ status: "error", data: null, message });
    } else {
      // For developer errors
      logger.error(err);
      return res
        .status(500)
        .json({ status: "error", data: null, message: "internal server error" });
    }
  };
  