import { Request, Response } from "express"
import { jwtVerify } from "../middleware/jwtVerify"




const context = async ({req, res}: { req: Request, res: Response}) => {

    let user = null
    const token =  req?.headers?.authorization?.startsWith('Bearer') ? req.headers.authorization.split(" ")[1] : null
    user = jwtVerify(token)
    return {
        res,
        req,
        user,
    };
}

export default context