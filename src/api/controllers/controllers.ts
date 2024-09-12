import { Request, Response, NextFunction, RequestHandler } from "express";
import { ObjectId } from "mongoose";
import { logger } from "../../config/logger";
import { BadreqError } from "../errorClass";

interface callback {
   error: Error | BadreqError | any
   user: { accessToken: string, statusCode: number } | null
  }

class apiControllers {

    async googleCallback(req: Request, res: Response, next: NextFunction) {
        const { error, user } = req.user as callback;
       
        try {
          console.log(req.user)
          if(error) throw error
          if(user) return res.status(user.statusCode).json({message: "Authentication successful", user });
        } catch (error) {
          next(error)
        }
      }
      
      async facebookCallback(req: Request, res: Response, next: NextFunction){

        try {
          const { error, user} = req.user as callback
        if(error) throw error
        if(user) res.status(user.statusCode).json({message: "Authentication successful", user })
        } catch (error) {
          next(error)
        }
      }

    
}

export default apiControllers