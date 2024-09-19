import { Request, Response, NextFunction, RequestHandler } from "express";
import { ObjectId } from "mongoose";
import { logger } from "../../config/logger";
import { BadreqError } from "../errorClass";


class apiControllers {

    async googleCallback(req: Request, res: Response, next: NextFunction) {
      const {accessToken } = req.user as { accessToken: string }
        if(accessToken)
        {
          return res.status(200).json({accessToken})          
        }
        throw new Error('Error signing up at this time')
      }
   
      
      async facebookCallback(req: Request, res: Response, next: NextFunction){
        const { accessToken } = req.user as { accessToken: string }
        if(accessToken)
        {
        
          return res.status(200).json({accessToken})          
        }
        throw new Error('Error signing up at this time')
      }

    
}

export default apiControllers
