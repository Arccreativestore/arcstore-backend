import { Request, Response, NextFunction, RequestHandler } from "express";
import { ObjectId } from "mongoose";
import { logger } from "../../config/logger";

interface callback {
    user:  {
        readonly _id: ObjectId
    }
    accessToken: string;
  }

class apiControllers
{
    async oAuthCallback(req: Request, res: Response, next: NextFunction) {
        const { user, accessToken } = req.user as callback;
    
        try {
          return res.status(202).json({
            message: "Authentication successful",
            user,
            accessToken,
          });
        } catch (error) {
          next(error)
        }
      }
    
}

export default apiControllers