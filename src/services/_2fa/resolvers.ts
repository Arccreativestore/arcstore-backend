
import { use } from "passport"
import { ErrorHandlers } from "../../helpers/errorHandler"
import { UserDatasource } from "../auth/datasource"
import { isEmail } from "../auth/types"
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import _2faDatasource from "./datasource"
import { ACCESS_SECRETKEY, REFRESH_SECRETKEY } from "../../config/config"
import { tokenDataSource } from "../tokens/dataSource"
import { Response } from "express"
import { User } from "../../app"

interface icontext {
    res: Response
}

export const _2faQuery = {
    async check_2faOtp(__: any, {data}: {data: {otp: number, email: string}}, context: icontext){

        const res = context.res
        const otp = data?.otp
        const email = data?.email
        if(!otp) throw new ErrorHandlers().UserInputError('Please input a valid otp')
        if(typeof otp != 'number') throw new ErrorHandlers().ValidationError('otp is invalid')
        isEmail({email})
        const userExist = await new UserDatasource().findByEmail(email)
        if(!userExist) throw new ErrorHandlers().NotFound('user with that email not found')
        
        const checkOtp = await new _2faDatasource().compareOtp(otp, userExist._id)
        if(!checkOtp) throw new ErrorHandlers().ValidationError('invalid otp')
        if (checkOtp.expiresAt.getTime() < Date.now()) {
          throw new ErrorHandlers().ValidationError('otp has expired');
        }
        
        const tokenId = crypto.randomBytes(12).toString('hex')
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000
  
        const accessToken = jwt.sign( { _id: userExist._id }, ACCESS_SECRETKEY as string, { expiresIn: "1hr" });
        const refreshToken = jwt.sign( { _id: userExist._id, tokenId}, REFRESH_SECRETKEY as string, { expiresIn: "7d" });
          
        await new tokenDataSource().newToken(tokenId, userExist._id, expiresAt)
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // for http
            expires: new Date(expiresAt),
          })
          await new _2faDatasource().deleteOtp(userExist._id)
          return { accessToken };
       
    },

    
}


export const _2faMutation = {

  async enable2fa(__: any, args: any, context: {user: User}){
    const userId = context?.user?._id
    if(!userId) throw new ErrorHandlers().AuthenticationError("Please Login to Proceed")
    const enable =  new _2faDatasource().enable2fa(userId)
    if(!enable) throw new Error('server error, cannot enable 2fa')
    return { status: "success", message: "2fa enabled successfully"}
  }

}

