import Base from "../base.js";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { logger } from "../config/logger";
import { ObjectId } from "mongoose";
import {
  BadreqError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../middleware/errors.js";
interface callback {
  user: createReturnAttributes; 
  accessToken: string;
}
interface createReturnAttributes {
  readonly _id: ObjectId;
}

class GeneralController {
  async oAuthCallback(req: Request, res: Response, next: NextFunction) {
    const { user, accessToken } = req.user as callback;

    try {
      return res.status(202).json({
        message: "Authentication successful",
        user,
        accessToken,
      });
    } catch (err) {
      (err: unknown, next: NextFunction) => {
        if (
          err instanceof BadreqError ||
          err instanceof ConflictError ||
          err instanceof NotFoundError ||
          err instanceof UnauthorizedError
        ) {
          return next(err);
        }

        const error = err as Error;
        logger.error(`Unhandled Error: ${error.message}`);
        return next(error);
      };
    }
  }
}

export default GeneralController;
