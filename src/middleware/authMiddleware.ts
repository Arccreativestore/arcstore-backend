import {Request, Response, NextFunction} from "express";
import {IAccount} from "../models/user"
import Base from "../base";

export const authMiddleware = async (request: Request, res: Response, next: NextFunction) => {

        const authorization:string | null = (request?.headers?.authorization?.startsWith('Bearer ') ? request.headers.authorization.substring(7) : null);

        console.log(authorization)
        const STATUS_CODE = 403
        const ERROR_MESSAGE = {
            "error": "Forbidden",
            "message": "invalid authorization",
            "statusCode": STATUS_CODE
        }
        if(!authorization)  {res.status(STATUS_CODE).json( {
            "error": "Forbidden",
            "message": "Authorization token missing",
            "statusCode": 401
        })
    }else{
        try {
            const userFound:IAccount | null = await new Base().extractUserDetails(authorization as string)
            console.log(userFound)
         
            if (!userFound) return res.status(STATUS_CODE).json(ERROR_MESSAGE)
         
            request.user = userFound;

            return next();
        } catch
            (e: any) {
        
            if (e.name === 'TokenExpiredError') {
                return res.status(STATUS_CODE).json({
                    "error": "Forbidden",
                    "message": "Token has expired",
                    "statusCode": STATUS_CODE
                });
            }
            return res.status(STATUS_CODE).json(ERROR_MESSAGE)
        }
    }
    }
;





