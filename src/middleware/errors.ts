import {
  Request,
  RequestHandler,
  ErrorRequestHandler,
  Response,
  NextFunction,
} from "express";
import { logger } from "../config/logger";
import { GraphQLError, GraphQLFormattedError } from "graphql";

//CUSTOM ERRORS
export class CustomError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

//BAD REQ ERROR
export class BadreqError extends CustomError {
    
  constructor(
    public message: string,
  ) {
    super(message, 400, true);
   
  }
}

// CONFLICT ERROR
export class ConflictError extends CustomError {
  constructor(
    public message: string,
  ) {
    super(message, 409, true);
   
  }
}

// NOTFOUND ERROR
export class NotFoundError extends CustomError {
  constructor(
    public message: string,
  ) {
    super(message, 404, true);
   
  }
}

//UNAUTHORIZED ERROR
export class UnauthorizedError extends CustomError {
  constructor(
    public message: string,
  ) {
    super(message, 401, true);
   
  }
}

//FORBIDDEN ERROR
export class ForbiddenError extends CustomError {
  constructor(
    public message: string,
  ) {
    super(message, 403, true);
   
  }
}

// EXPRESS ERROR HANDLER
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
    return res
      .status(statusCode)
      .json({ status: "error", data: null, message });
  } else {
    // For developer errors
    logger.error(err);
    return res
      .status(500)
      .json({ status: "error", data: null, message: "internal server error" });
  }
};

// Graphql Error Handler
interface ErrorFormat extends GraphQLFormattedError {
  isOperational: boolean;
  status: string;
  statusCode: number;
}

// GRAPHQL ERROR HANDLER

export const GraphError = (
  formattedError: GraphQLFormattedError,
  error: unknown
): ErrorFormat => {
  const err = (error as GraphQLError).originalError || error;

  let ErrorObject: ErrorFormat = {
    message: "Internal Server Error",
    statusCode: 500,
    isOperational: false,
    status: "error",
    path: formattedError.path,
    locations: formattedError.locations,
  };
  if (err instanceof CustomError) {
    ErrorObject =
      // no logging for user errors
      {
        message: err.message ? err.message : "Error",
        statusCode: err.statusCode ? err.statusCode : 500,
        isOperational: true,
        status: "error",
      };
  } else {
    // Log unexpected internal errors for further investigation
    logger.error(
      `Internal Server Error: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      {
        stack:
          err instanceof Error
            ? err.stack
            : "No stack trace",
      }
    );
  }
  return ErrorObject;
};
