import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";
import path from "path";
import AppError from "../api/errorClass";
import { STATUS_CODES } from "http";
interface format {
  message: string;
  status: string;
  statusCode: number;
  code: string;
  path?: any;
  stack?: any
}
export const expressHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let formatError: format =
  {
    message: error.message || "SERVER ERROR",
    code: error.code || "SERVER_ERROR",
    statusCode: error.statusCode || 500,
    status: error.status || "Error",
    path: error.path,
    stack: error.stack
  };

  // user errors
  if (error instanceof AppError) {
    formatError = {
      message: error.message || "SERVER ERROR",
      code: error.code || "SERVER_ERROR",
      statusCode: error.statusCode || 500,
      status: error.status || "Error",
    };

    return res.status(formatError.statusCode).json(formatError);
  }
  // server errors
  logger.error(error)
  return res.status(500).json(formatError)
};
