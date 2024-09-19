import Base from "../../base";
import { ACCESS_SECRETKEY, REFRESH_SECRETKEY, VERIFYEMAIL_SECRETKEY } from "../../config/config";
import { ErrorHandlers } from "../../helpers/errorHandler";
import jwt from 'jsonwebtoken'
import { logger } from "../../config/logger";
import { tokenDataSource } from "./dataSource";
import {UserDatasource}  from "../auth/datasource";
import crypto from 'crypto'
import { Request, Response } from "express";


class RefreshToken extends Base
{
    async generateToken(_: any, args: any, context: { req: Request, res: Response}): Promise<{accessToken: string}>{

   try {
        const { req, res } = context
        const token = req?.cookies?.refreshToken
        if(!token) throw new ErrorHandlers().ValidationError('Token not Found in Request')
        const verify: any = this.decodeRefresh(token)
        const payload: any = this.isTokenExpired(verify)
        if(payload) throw new ErrorHandlers().AuthenticationError('Refresh Token expired, Please Login To Proceed')
       
        let {tokenId, _id } = verify
        
        if(!tokenId || !_id)
        {
                throw new ErrorHandlers().ValidationError('invalid token, please Login to continue')
        }

        const findToken = await new tokenDataSource().findToken(tokenId)
        if(!findToken || findToken.used)
        {
                // suspicious login possibly send an email to the user to change password
                await new tokenDataSource().deleteAllTokens(_id)
                throw new ErrorHandlers().ForbiddenError('Reused Token Detected, Please Login to Continue')
        }
        
        await new tokenDataSource().updateTokenStatus(tokenId)
        const refreshToken = jwt.sign( { _id, tokenId}, REFRESH_SECRETKEY as string, { expiresIn: "7d" });
        const accessToken = jwt.sign({_id: payload._id}, ACCESS_SECRETKEY as string, {expiresIn: '1hr'})

        tokenId = crypto.randomBytes(12).toString('hex')
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000

        await new tokenDataSource().newToken(tokenId, _id, expiresAt) 

        res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // for http
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              })
        return {accessToken}
        }
         catch (error: any) {
        logger.error(error)
        throw error
   }
}
}
export const tokenMutation = {
generateToken: 
(parent: any, args: any, context: { req: Request, res: Response}) => new RefreshToken().generateToken(parent, args, context)
};


export const tokenQuery = {
        Me: () => "Example kind" 
};