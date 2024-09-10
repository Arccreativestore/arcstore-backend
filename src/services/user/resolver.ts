import UserDatasource from './datasource';
import {Request, Response, CookieOptions} from 'express'
import { IReg, registerResponse} from "./interfaces";
import {ConflictError, BadreqError, NotFoundError} from '../../middleware/errors'
import jwt from 'jsonwebtoken'
import '../../events/user/userEvents'
import {VERIFY_SECRETKEY} from '../../config/config'
import { eventEmitter } from '../../events/user/userEvents';
import { jwtVerify } from '../../middleware/jwtVerify';
import { logger } from '../../config/logger';

export const UserMutation = {
   
    async userRegistration(__: unknown, {data}: { data: IReg }):Promise<registerResponse> {
       const {email, username, password} = data
        /// input validation can be done here 
        if(!email || !username || !password)
        {
            throw new BadreqError('input fields are incomplete')
        }
        const findEmail = await UserDatasource.findByEmail(email)
        
        if(findEmail)
        {
            throw new ConflictError('user already exist')
        }
         
         const token = jwt.sign({email}, VERIFY_SECRETKEY as string, {expiresIn: '1hr'})
         eventEmitter.emit("newUser", {email, token, username})

         const createUser = await UserDatasource.userRegistration(data);
         if(createUser)
         {
            const {_id, email, username, role} = createUser
            return {status: "sucess", _id, email, username, role }
         }

       throw new Error('Error registering, please try again later')
    },

};

export const verifyUserMutation = 
{
    async verifyAccount(_: any, args: any, {req}: {req: Request})
    {
       
       const user = req.user
       logger.info(user)
       
        const {email} = user
        const findEmail = await UserDatasource.findByEmail(email)
        if(!findEmail)
        {
            throw new NotFoundError('User does not exist')
        }
        const verify = await UserDatasource.verifyEmail(email)
        if(verify)
        {
            logger.info(verify)
            return { status: "success", verify }
        }
        

    }
}
export const UserQuery = {
    async getUserProfile(){
        return "hello"
    }

}
